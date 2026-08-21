// Desktop: WASD + drag-to-look (no Pointer Lock — keeps it usable inside embedded
// preview frames). Mobile: virtual joystick + touch-drag camera — docs/54_MOBILE_ARCHITECTURE.md §5.

export interface MoveInput {
  forward: number; // -1..1
  strafe: number; // -1..1
  run: boolean;
}

export interface LookDelta {
  yaw: number;
  pitch: number;
}

export class InputManager {
  private readonly keys = new Set<string>();
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private accumYaw = 0;
  private accumPitch = 0;

  private joystickActive = false;
  private joystickOriginX = 0;
  private joystickOriginY = 0;
  private joystickDx = 0;
  private joystickDy = 0;

  constructor(
    private readonly canvas: HTMLElement,
    private readonly joystickBase: HTMLElement | null,
    private readonly joystickKnob: HTMLElement | null,
  ) {
    window.addEventListener("keydown", (e) => this.keys.add(e.key.toLowerCase()));
    window.addEventListener("keyup", (e) => this.keys.delete(e.key.toLowerCase()));

    canvas.addEventListener("pointerdown", (e) => {
      // Ignore drags that start on UI panels/inputs layered above the canvas.
      if (e.target !== canvas) return;
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });
    window.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.accumYaw -= dx * 0.005;
      this.accumPitch -= dy * 0.005;
    });
    window.addEventListener("pointerup", () => {
      this.dragging = false;
    });

    if (joystickBase && joystickKnob) {
      const rect = () => joystickBase.getBoundingClientRect();
      const start = (clientX: number, clientY: number) => {
        const r = rect();
        this.joystickActive = true;
        this.joystickOriginX = r.left + r.width / 2;
        this.joystickOriginY = r.top + r.height / 2;
      };
      const move = (clientX: number, clientY: number) => {
        if (!this.joystickActive) return;
        const radius = rect().width / 2;
        let dx = clientX - this.joystickOriginX;
        let dy = clientY - this.joystickOriginY;
        const len = Math.hypot(dx, dy);
        if (len > radius) {
          dx = (dx / len) * radius;
          dy = (dy / len) * radius;
        }
        this.joystickDx = dx / radius;
        this.joystickDy = dy / radius;
        joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
      };
      const end = () => {
        this.joystickActive = false;
        this.joystickDx = 0;
        this.joystickDy = 0;
        joystickKnob.style.transform = "translate(0, 0)";
      };

      joystickBase.addEventListener("touchstart", (e) => {
        start(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      });
      joystickBase.addEventListener("touchmove", (e) => {
        move(e.touches[0].clientX, e.touches[0].clientY);
        e.preventDefault();
      });
      joystickBase.addEventListener("touchend", end);
      joystickBase.addEventListener("touchcancel", end);
    }
  }

  get moveInput(): MoveInput {
    let forward = 0;
    let strafe = 0;
    if (this.keys.has("w") || this.keys.has("arrowup")) forward += 1;
    if (this.keys.has("s") || this.keys.has("arrowdown")) forward -= 1;
    if (this.keys.has("d") || this.keys.has("arrowright")) strafe += 1;
    if (this.keys.has("a") || this.keys.has("arrowleft")) strafe -= 1;

    if (this.joystickActive) {
      forward = -this.joystickDy;
      strafe = this.joystickDx;
    }

    const run = this.keys.has("shift");
    return { forward: clamp(forward, -1, 1), strafe: clamp(strafe, -1, 1), run };
  }

  /** Returns the look delta accumulated since the last call, then resets it. */
  consumeLook(): LookDelta {
    const delta = { yaw: this.accumYaw, pitch: this.accumPitch };
    this.accumYaw = 0;
    this.accumPitch = 0;
    return delta;
  }

  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
