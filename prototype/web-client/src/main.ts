// Vertical slice entry point — docs/68_VERTICAL_SLICE.md, docs/46_MASTER_ACCEPTANCE_TEST.md.
// Wires the 3D hall, third-person player, AI agents (imported rigged characters — see
// characters/GLTFCharacterLoader.ts and public/models/NOTICE.md), voice input, and the
// contextual UI together against core/packages/api over HTTP.

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { bankverseApi } from "./api/client.js";
import type { ChatResponse } from "./api/client.js";
import { AgentCharacter, type AgentStatus } from "./agents/AgentCharacter.js";
import { type CharacterInstance, instantiateCharacter, loadCharacterBase } from "./characters/GLTFCharacterLoader.js";
import { DEMO_ACCOUNT_ID, DEMO_CUSTOMER_NAME, DEMO_USER_ID } from "./constants.js";
import { InputManager } from "./player/InputManager.js";
import { PlayerController } from "./player/PlayerController.js";
import { UIController } from "./ui/UIController.js";
import { VoiceInput } from "./voice/VoiceInput.js";
import { loadStaticNpc, loadWalkingNpc, type StaticNpc, type WalkingNpc } from "./world/AmbientNPCs.js";
import { buildHallLighting } from "./world/BankHall.js";
import { loadBankHall } from "./world/ImportedBankHall.js";

const RECEPTION_GREETING =
  "Assalomu alaykum. AI BankVerse'ga xush kelibsiz. Sizga qanday yordam berishim mumkin?"; // docs/03 §1, verbatim

const AGENT_GREETINGS: Record<string, string> = {
  reception: RECEPTION_GREETING,
  payment: "Assalomu alaykum. To'lovlar bo'yicha yordam beraman.",
  credit: "Assalomu alaykum. Kredit bo'yicha yordam beraman.", // docs/45 Stage 9
  deposit: "Assalomu alaykum. Depozit variantlarini ko'rsataman.",
};

const CHARACTER_MODEL_URL = "/models/Soldier.glb"; // see public/models/NOTICE.md
const CHARACTER_TINTS: Record<string, number> = {
  player: 0x33455e, // steel blue
  reception: 0x203a5c, // navy
  payment: 0x2f3b2a, // deep olive
  credit: 0x4a2f3a, // burgundy
  deposit: 0x2f2f38, // charcoal
};

/**
 * Hides the visor and nudges the uniform's hue per character — see public/models/NOTICE.md.
 * `Soldier.glb` is a single body+clothing texture atlas (materials: `vanguardbodymat`,
 * `vanguard_visormat`, both base color 0xe7e7e7 — confirmed by inspecting the loaded
 * material list) with no separate skin material, so a full color multiply crushed the
 * whole character (face included) toward black. A low-alpha lerp keeps the original
 * texture's shading intact while still giving each character a distinct cast.
 */
function styleCharacter(group: THREE.Group, tint: number): void {
  group.traverse((node) => {
    if (node.name.toLowerCase().includes("visor")) node.visible = false;

    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      const standard = material as THREE.MeshStandardMaterial;
      if (standard.color) standard.color.lerp(new THREE.Color(tint), 0.22);
    }
  });
}

async function main() {
  // --- Renderer / scene / camera -------------------------------------------------------
  const canvas = document.getElementById("scene") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Physically-plausible tone mapping — flat sRGB-clamped output is what made everything
  // look like a "greybox" even after adding materials; ACES + a reflection environment is
  // most of the perceived jump from "game placeholder" to "AAA-ish" at zero asset cost.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a140c);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  // --- World ----------------------------------------------------------------------------
  const hall = await loadBankHall();
  scene.add(hall.group);
  buildHallLighting(scene);

  // --- Character base (loaded once, cloned per instance — docs/18 §4 varied appearance) --
  const characterBase = await loadCharacterBase(CHARACTER_MODEL_URL);
  console.debug(
    "[characters] loaded",
    CHARACTER_MODEL_URL,
    "clips:",
    characterBase.animations.map((c) => c.name),
  );

  function spawnCharacter(tintKey: keyof typeof CHARACTER_TINTS): CharacterInstance {
    const instance = instantiateCharacter(characterBase);
    // Grounding now happens in AgentCharacter/PlayerController, after they set the
    // character's final position — see the comment in AmbientNPCs.ts for why the order
    // matters. styleCharacter only touches materials, so it's fine to run here.
    styleCharacter(instance.group, CHARACTER_TINTS[tintKey]);
    return instance;
  }

  // --- Agents (docs/64_AI_AGENT_ROSTER.md — reception, payment, credit, deposit) ---------
  const agents = new Map<string, AgentCharacter>();
  agents.set(
    "reception",
    new AgentCharacter({
      id: "reception",
      name: "Reception",
      role: "Receptionist",
      position: hall.receptionDeskPosition.clone().add(new THREE.Vector3(0, 0, -1.4)),
      facing: 0, // faces the entrance (+Z), to greet arriving customers
      character: spawnCharacter("reception"),
    }),
  );

  const roleByStationIndex = ["payment", "payment", "credit", "credit", "deposit", "deposit"];
  hall.bankerStations.forEach((station, index) => {
    const role = roleByStationIndex[index % roleByStationIndex.length];
    const id = index < 2 ? "payment" : index < 4 ? "credit" : role; // first two stations = the named agents
    if (agents.has(id)) return; // one visible AgentCharacter per department is enough for the slice
    agents.set(
      id,
      new AgentCharacter({
        id,
        name: id === "payment" ? "Aziza" : id === "credit" ? "Aziza Karimova" : "Deposit Agent",
        role: id === "payment" ? "Payment Specialist" : id === "credit" ? "Credit Specialist" : "Deposit Specialist",
        position: station.position,
        facing: station.facing,
        character: spawnCharacter(id as keyof typeof CHARACTER_TINTS),
      }),
    );
  });
  for (const agent of agents.values()) scene.add(agent.group);

  // --- Ambient NPCs (docs/20_NPC_LIFE_SIMULATION.md, lightweight slice) ------------------
  // Positions were confirmed open/correctly-floored via the same raycasting approach as
  // the reception/banker stations above (see ImportedBankHall.ts), avoiding those spots.
  const staticNpcs: StaticNpc[] = await Promise.all([
    loadStaticNpc({ url: "/models/npcs/police_officer.glb", position: new THREE.Vector3(12, 0, 3), facing: Math.PI * 0.6 }),
    loadStaticNpc({ url: "/models/npcs/staff_woman.glb", position: new THREE.Vector3(1, 0, -25), facing: 0 }),
    loadStaticNpc({ url: "/models/npcs/client_woman.glb", position: new THREE.Vector3(-12, 0, 5), facing: -Math.PI * 0.4 }),
    loadStaticNpc({ url: "/models/npcs/client_man.glb", position: new THREE.Vector3(12, 0, -20), facing: Math.PI * 0.7 }),
    loadStaticNpc({ url: "/models/npcs/client_elegant.glb", position: new THREE.Vector3(-12, 0, -20), facing: -Math.PI * 0.7 }),
  ]);
  for (const npc of staticNpcs) scene.add(npc.group);

  const walkingNpc: WalkingNpc = await loadWalkingNpc({
    url: "/models/npcs/walking_customer.glb",
    waypoints: [new THREE.Vector3(-10, 0, 8), new THREE.Vector3(10, 0, 8)],
  });
  scene.add(walkingNpc.group);

  // --- Player -----------------------------------------------------------------------------
  const input = new InputManager(
    canvas,
    document.getElementById("mobile-joystick-base"),
    document.getElementById("mobile-joystick-knob"),
  );
  // Spawns just in front of the reception counter, in the confirmed-open floor area — see
  // ImportedBankHall.ts's comment on receptionDeskPosition for how that was verified.
  const spawn = hall.receptionDeskPosition.clone().add(new THREE.Vector3(0, 0, 12));
  const player = new PlayerController(camera, input, hall.bounds, spawn, spawnCharacter("player"));
  scene.add(player.body);

  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    document.getElementById("mobile-joystick")?.classList.remove("hidden");
  }

  // --- UI / conversation state ------------------------------------------------------------
  const ui = new UIController();
  let sessionId: string | undefined;
  let greetedOnce = false;
  let lastPromptAgentId: string | null = null;
  let wasEKeyDown = false;

  async function sendMessage(text: string): Promise<void> {
    ui.hideConfirmation();
    try {
      const res = await bankverseApi.chat(DEMO_USER_ID, text, sessionId);
      sessionId = res.sessionId;
      handleChatResponse(res);
    } catch (err) {
      ui.showConversation("Reception", "Texnik xatolik yuz berdi. Birozdan so'ng qayta urinib ko'ring.");
      console.error(err);
    }
  }

  function handleChatResponse(res: ChatResponse): void {
    const agent = agents.get(res.agentId);
    const agentName = agent?.name ?? "Reception";
    setAgentStatus(res.agentId, stateToAgentStatus(res.state));

    if (res.state === "WAITING_CONFIRMATION" && res.payment) {
      ui.hideConversation();
      ui.showConfirmation(
        {
          provider: res.payment.provider,
          amount: res.payment.amount,
          currency: res.payment.currency,
          customerName: DEMO_CUSTOMER_NAME,
        },
        res.response.text,
        () => sendMessage("Ha, tasdiqlayman."),
        () => sendMessage("Yo'q, bekor qiling."),
      );
      return;
    }

    ui.hideConfirmation();
    ui.showConversation(agentName, res.response.text);

    if (res.state === "COMPLETED" && res.response.nextAction === "SHOW_RECEIPT") {
      void showLatestReceipt();
    }
  }

  async function showLatestReceipt(): Promise<void> {
    try {
      const { transactions } = await bankverseApi.getTransactions(DEMO_ACCOUNT_ID, 1);
      const latest = transactions[0];
      if (!latest) return;
      ui.showReceipt(
        {
          transactionId: latest.id,
          amount: latest.amount,
          currency: latest.currency,
          provider: latest.provider ?? "electricity",
          status: latest.status,
          date: latest.completedAt ?? latest.createdAt,
        },
        () => ui.hideReceipt(),
      );
    } catch (err) {
      console.error(err);
    }
  }

  function stateToAgentStatus(state: string): AgentStatus {
    switch (state) {
      case "PROCESSING":
      case "EXECUTING":
      case "WAITING_CONFIRMATION":
        return "PROCESSING";
      case "FAILED":
        return "AVAILABLE";
      default:
        return "AVAILABLE";
    }
  }

  function setAgentStatus(agentId: string, status: AgentStatus): void {
    agents.get(agentId)?.setStatus(status);
  }

  // --- Voice ------------------------------------------------------------------------------
  const voice = new VoiceInput(
    (text) => {
      textInput.value = text;
      void sendMessage(text);
    },
    (listening) => ui.setMicListening(listening),
  );
  const micButton = document.getElementById("mic-button") as HTMLButtonElement;
  if (!voice.isSupported) {
    micButton.disabled = true;
    micButton.title = "Ovozli kirish bu brauzerda mavjud emas — matn kiriting.";
  }
  micButton.addEventListener("click", () => voice.toggle());

  // --- Text input bar -----------------------------------------------------------------------
  const textInput = document.getElementById("text-input") as HTMLInputElement;
  const textForm = document.getElementById("text-input-bar") as HTMLFormElement;
  textForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = textInput.value.trim();
    if (!text) return;
    textInput.value = "";
    void sendMessage(text);
  });

  // --- Proximity interaction (docs/02 §3, docs/68) -------------------------------------------
  function updateInteraction(): void {
    let nearest: AgentCharacter | null = null;
    let nearestDistance = 4;
    for (const agent of agents.values()) {
      const distance = agent.distanceTo(player.position);
      if (distance < nearestDistance) {
        nearest = agent;
        nearestDistance = distance;
      }
    }

    if (nearest) {
      ui.setInteractionPrompt(`[E] Talk to ${nearest.name}`);
    } else {
      ui.setInteractionPrompt(null);
    }
    lastPromptAgentId = nearest?.id ?? null;

    const eDown = input.isKeyPressed("e");
    if (eDown && !wasEKeyDown && nearest) {
      ui.hideConfirmation();
      ui.showConversation(nearest.name, AGENT_GREETINGS[nearest.id] ?? "Sizga qanday yordam bera olaman?");
      textInput.focus();
    }
    wasEKeyDown = eDown;
  }

  document.getElementById("interaction-prompt")?.addEventListener("click", () => {
    if (!lastPromptAgentId) return;
    const agent = agents.get(lastPromptAgentId);
    if (!agent) return;
    ui.showConversation(agent.name, AGENT_GREETINGS[agent.id] ?? "Sizga qanday yordam bera olaman?");
    textInput.focus();
  });

  // --- Boot sequence — docs/03 §1 First Launch ------------------------------------------------
  setTimeout(() => {
    ui.hideLoadingScreen();
    setTimeout(() => {
      if (!greetedOnce) {
        greetedOnce = true;
        ui.showConversation("Reception", RECEPTION_GREETING);
      }
    }, 700);
  }, 600);

  // --- Animation loop -------------------------------------------------------------------------
  const clock = new THREE.Clock();
  let elapsed = 0;
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    player.update(dt);
    for (const agent of agents.values()) agent.update(dt, player.position);
    for (const npc of staticNpcs) npc.update(elapsed);
    walkingNpc.update(dt);
    updateInteraction();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

void main();
