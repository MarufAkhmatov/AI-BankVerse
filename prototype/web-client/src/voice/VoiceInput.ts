// docs/17_VOICE_INTERACTION_SPECIFICATION.md — browser Web Speech API behind the same
// IVoiceProvider shape used server-side (core/packages/voice-mock). §14 Fallback: if voice
// is unavailable, text input keeps working and the 3D environment is unaffected.

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export class VoiceInput {
  readonly isSupported: boolean;
  private recognition: SpeechRecognitionLike | null = null;
  private listening = false;

  constructor(
    private readonly onTranscript: (text: string) => void,
    private readonly onStateChange: (listening: boolean) => void,
  ) {
    const Ctor = getSpeechRecognitionCtor();
    this.isSupported = Ctor !== null;
    if (Ctor) {
      this.recognition = new Ctor();
      this.recognition.lang = "uz-UZ";
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.onresult = (event: any) => {
        const text = event.results?.[0]?.[0]?.transcript ?? "";
        if (text) this.onTranscript(text);
      };
      this.recognition.onerror = () => this.stop();
      this.recognition.onend = () => {
        this.listening = false;
        this.onStateChange(false);
      };
    }
  }

  toggle(): void {
    if (!this.recognition) return;
    if (this.listening) this.stop();
    else this.start();
  }

  private start(): void {
    if (!this.recognition || this.listening) return;
    this.listening = true;
    this.onStateChange(true);
    this.recognition.start();
  }

  private stop(): void {
    if (!this.recognition) return;
    this.listening = false;
    this.onStateChange(false);
    this.recognition.stop();
  }
}
