// Agent response wording, externalized from orchestration logic — docs/16 §15
// ("prompts must be externalized, do NOT hardcode long prompts inside gameplay classes").

import type { AgentResponse, IntentCategory, Language } from "@bankverse/domain";

export type ResponseStage = "acknowledge" | "confirm" | "success" | "failure" | "unknown" | "clarify";

export interface TemplateData {
  amount?: number;
  currency?: string;
  provider?: string;
  customerName?: string;
  transactionId?: string;
  errorMessage?: string;
}

function formatAmount(data: TemplateData): string {
  const amount = data.amount ?? 0;
  return `${amount.toLocaleString("en-US")} ${data.currency ?? "UZS"}`;
}

type Templates = Partial<Record<IntentCategory, Partial<Record<ResponseStage, Partial<Record<Language, (d: TemplateData) => string>>>>>>;

const TEMPLATES: Templates = {
  UTILITY_PAYMENT: {
    acknowledge: {
      uz: () => "Elektr energiyasi uchun to'lovni tayyorlayman.",
      ru: () => "Подготавливаю оплату за электроэнергию.",
      en: () => "Preparing your electricity payment.",
    },
    // docs/46_MASTER_ACCEPTANCE_TEST.md Scenario 006 — exact wording.
    confirm: {
      uz: (d) => `${formatAmount(d)} to'lovni tasdiqlaysizmi?`,
      ru: (d) => `Подтверждаете оплату ${formatAmount(d)}?`,
      en: (d) => `Confirm the ${formatAmount(d)} payment?`,
    },
    // docs/46 Scenario 008 / docs/02 §9 — exact wording.
    success: {
      uz: () => "To'lov muvaffaqiyatli amalga oshirildi.",
      ru: () => "Платеж успешно выполнен.",
      en: () => "The payment was completed successfully.",
    },
    failure: {
      uz: (d) => `Kechirasiz, to'lovni amalga oshirib bo'lmadi. Sabab: ${d.errorMessage ?? "noma'lum xatolik"}.`,
      ru: (d) => `К сожалению, платеж не выполнен. Причина: ${d.errorMessage ?? "неизвестная ошибка"}.`,
      en: (d) => `Sorry, the payment could not be completed. Reason: ${d.errorMessage ?? "unknown error"}.`,
    },
  },
  CREDIT_APPLICATION: {
    // docs/01_PRODUCT_VISION.md §5 — exact wording.
    acknowledge: {
      uz: () => "Albatta. Siz uchun kredit variantlarini ochaman.",
      ru: () => "Конечно. Открываю варианты кредита для вас.",
      en: () => "Of course. Opening credit options for you.",
    },
  },
  DEPOSIT_INFORMATION: {
    acknowledge: {
      uz: () => "Mavjud depozit variantlarini ko'rsataman.",
      en: () => "Showing the available deposit options.",
    },
  },
  ACCOUNT_BALANCE: {
    acknowledge: {
      uz: () => "Hisobingiz ma'lumotlarini olib kelaman.",
      en: () => "Pulling up your account balance.",
    },
  },
  HUMAN_ESCALATION: {
    acknowledge: {
      uz: () => "Sizni operatorga ulayman.",
      ru: () => "Соединяю вас с оператором.",
      en: () => "Connecting you with a human operator.",
    },
  },
};

// docs/02_GAME_DESIGN_DOCUMENT.md §11 — "No Dead Ends", exact wording.
const CLARIFY_TEXT: Record<Language, string> = {
  uz: "Men sizga yordam beraman. Siz kredit, to'lov, karta yoki boshqa xizmatlardan qaysi birini nazarda tutdingiz?",
  ru: "Я помогу вам. Вы имели в виду кредит, платеж, карту или другую услугу?",
  en: "I'm here to help. Did you mean credit, a payment, a card, or another service?",
};

const STAGE_META: Record<ResponseStage, { emotion: string; animation: string; nextAction: string }> = {
  acknowledge: { emotion: "professional_positive", animation: "nod", nextAction: "OPEN_SERVICE_PANEL" },
  confirm: { emotion: "professional_neutral", animation: "present_panel", nextAction: "AWAIT_CONFIRMATION" },
  success: { emotion: "professional_positive", animation: "confirm_gesture", nextAction: "SHOW_RECEIPT" },
  failure: { emotion: "concerned", animation: "explain_gesture", nextAction: "SHOW_ERROR" },
  clarify: { emotion: "professional_neutral", animation: "open_hand", nextAction: "AWAIT_CLARIFICATION" },
  unknown: { emotion: "professional_neutral", animation: "open_hand", nextAction: "AWAIT_CLARIFICATION" },
};

export function renderResponse(
  intent: IntentCategory,
  stage: ResponseStage,
  language: Language,
  data: TemplateData = {},
): AgentResponse {
  const meta = STAGE_META[stage];

  if (stage === "clarify" || stage === "unknown") {
    return { text: CLARIFY_TEXT[language] ?? CLARIFY_TEXT.uz, ...meta };
  }

  const byIntent = TEMPLATES[intent]?.[stage];
  const render = byIntent?.[language] ?? byIntent?.uz;
  if (render) {
    return { text: render(data), ...meta };
  }

  // Generic fallback for intents/stages without dedicated wording yet — never silent.
  return { text: CLARIFY_TEXT[language] ?? CLARIFY_TEXT.uz, ...meta };
}
