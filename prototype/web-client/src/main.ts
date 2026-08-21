// Vertical slice entry point — docs/68_VERTICAL_SLICE.md, docs/46_MASTER_ACCEPTANCE_TEST.md.
// Wires the 3D hall, third-person player, placeholder AI agents, voice input, and the
// contextual UI together against core/packages/api over HTTP.

import * as THREE from "three";
import { bankverseApi } from "./api/client.js";
import type { ChatResponse } from "./api/client.js";
import { AgentCharacter, type AgentStatus } from "./agents/AgentCharacter.js";
import { DEMO_ACCOUNT_ID, DEMO_CUSTOMER_NAME, DEMO_USER_ID, HALL } from "./constants.js";
import { InputManager } from "./player/InputManager.js";
import { PlayerController } from "./player/PlayerController.js";
import { UIController } from "./ui/UIController.js";
import { VoiceInput } from "./voice/VoiceInput.js";
import { buildBankHall, buildHallLighting, HALL_BOUNDS } from "./world/BankHall.js";

const RECEPTION_GREETING =
  "Assalomu alaykum. AI BankVerse'ga xush kelibsiz. Sizga qanday yordam berishim mumkin?"; // docs/03 §1, verbatim

const AGENT_GREETINGS: Record<string, string> = {
  reception: RECEPTION_GREETING,
  payment: "Assalomu alaykum. To'lovlar bo'yicha yordam beraman.",
  credit: "Assalomu alaykum. Kredit bo'yicha yordam beraman.", // docs/45 Stage 9
  deposit: "Assalomu alaykum. Depozit variantlarini ko'rsataman.",
};

// --- Renderer / scene / camera ---------------------------------------------------------
const canvas = document.getElementById("scene") as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a140c);

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

// --- World -------------------------------------------------------------------------------
const hall = buildBankHall();
scene.add(hall.group);
buildHallLighting(scene);

// --- Agents (docs/64_AI_AGENT_ROSTER.md — reception, payment, credit, deposit) ------------
const agents = new Map<string, AgentCharacter>();
agents.set(
  "reception",
  new AgentCharacter({
    id: "reception",
    name: "Reception",
    role: "Receptionist",
    position: hall.receptionDeskPosition.clone().add(new THREE.Vector3(0, 0, -1.4)),
    bodyColor: 0x3a4a63,
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
      bodyColor: 0x4a3a2a,
    }),
  );
});
for (const agent of agents.values()) scene.add(agent.group);

// --- Player ------------------------------------------------------------------------------
const input = new InputManager(
  canvas,
  document.getElementById("mobile-joystick-base"),
  document.getElementById("mobile-joystick-knob"),
);
const spawn = new THREE.Vector3(0, 0, HALL_BOUNDS.entranceZ - 3);
const player = new PlayerController(camera, input, HALL_BOUNDS, spawn);
scene.add(player.body);

if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
  document.getElementById("mobile-joystick")?.classList.remove("hidden");
}

// --- UI / conversation state ---------------------------------------------------------------
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

// --- Voice -------------------------------------------------------------------------------
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

// --- Text input bar ------------------------------------------------------------------------
const textInput = document.getElementById("text-input") as HTMLInputElement;
const textForm = document.getElementById("text-input-bar") as HTMLFormElement;
textForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  if (!text) return;
  textInput.value = "";
  void sendMessage(text);
});

// --- Proximity interaction (docs/02 §3, docs/68) --------------------------------------------
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

// --- Boot sequence — docs/03 §1 First Launch -------------------------------------------------
setTimeout(() => {
  ui.hideLoadingScreen();
  setTimeout(() => {
    if (!greetedOnce) {
      greetedOnce = true;
      ui.showConversation("Reception", RECEPTION_GREETING);
    }
  }, 700);
}, 600);

// --- Animation loop --------------------------------------------------------------------------
const clock = new THREE.Clock();
function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  player.update(dt);
  for (const agent of agents.values()) agent.lookAtTarget(player.position);
  updateInteraction();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
