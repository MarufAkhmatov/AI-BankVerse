// Deterministic, offline intent triggers — docs/17_VOICE_INTERACTION_SPECIFICATION.md §5
// ("the user must NOT be forced to use predefined commands") and docs/23_TESTING_STRATEGY.md §3.
// New services/intents are added here without touching the orchestrator (horizontal growth).

import { IntentRegistry } from "@bankverse/domain";

export function buildIntentRegistry(): IntentRegistry {
  const registry = new IntentRegistry();

  // --- UTILITY_PAYMENT — the flagship vertical-slice scenario ---------------------
  registry.register({
    intent: "UTILITY_PAYMENT",
    service: "electricity",
    language: "uz",
    requiresConfirmation: true,
    patterns: [/elektr/],
  });
  registry.register({
    intent: "UTILITY_PAYMENT",
    service: "electricity",
    language: "ru",
    requiresConfirmation: true,
    patterns: [/электричеств/],
  });
  registry.register({
    intent: "UTILITY_PAYMENT",
    service: "electricity",
    language: "en",
    requiresConfirmation: true,
    patterns: [/electricity/],
  });
  registry.register({
    intent: "UTILITY_PAYMENT",
    service: "gas",
    language: "uz",
    requiresConfirmation: true,
    patterns: [/\bgaz\b/],
  });
  registry.register({
    intent: "UTILITY_PAYMENT",
    service: "water",
    language: "uz",
    requiresConfirmation: true,
    patterns: [/\bsuv\b/],
  });

  // --- CREDIT_APPLICATION ----------------------------------------------------------
  registry.register({
    intent: "CREDIT_APPLICATION",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/kredit/],
  });
  registry.register({
    intent: "CREDIT_APPLICATION",
    language: "ru",
    requiresConfirmation: false,
    patterns: [/кредит/],
  });
  registry.register({
    intent: "CREDIT_APPLICATION",
    language: "en",
    requiresConfirmation: false,
    patterns: [/\bloan\b/, /\bcredit\b/],
  });

  // --- ACCOUNT_BALANCE ---------------------------------------------------------------
  registry.register({
    intent: "ACCOUNT_BALANCE",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/qancha pul/, /\bbalans/],
  });
  registry.register({
    intent: "ACCOUNT_BALANCE",
    language: "ru",
    requiresConfirmation: false,
    patterns: [/баланс/, /сколько.*денег/],
  });
  registry.register({
    intent: "ACCOUNT_BALANCE",
    language: "en",
    requiresConfirmation: false,
    patterns: [/balance/],
  });

  // --- TRANSACTION_HISTORY -----------------------------------------------------------
  registry.register({
    intent: "TRANSACTION_HISTORY",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/tranzaksi/],
  });
  registry.register({
    intent: "TRANSACTION_HISTORY",
    language: "ru",
    requiresConfirmation: false,
    patterns: [/транзакц/],
  });
  registry.register({
    intent: "TRANSACTION_HISTORY",
    language: "en",
    requiresConfirmation: false,
    patterns: [/transaction/],
  });

  // --- DEPOSIT_INFORMATION ------------------------------------------------------------
  registry.register({
    intent: "DEPOSIT_INFORMATION",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/depozit/, /omonat/],
  });
  registry.register({
    intent: "DEPOSIT_INFORMATION",
    language: "ru",
    requiresConfirmation: false,
    patterns: [/депозит/],
  });
  registry.register({
    intent: "DEPOSIT_INFORMATION",
    language: "en",
    requiresConfirmation: false,
    patterns: [/deposit/],
  });

  // --- CARD_BLOCK / CARD_SERVICE --------------------------------------------------------
  registry.register({
    intent: "CARD_BLOCK",
    language: "uz",
    requiresConfirmation: true,
    patterns: [/kartamni\s+blok/, /kartani\s+blok/],
  });
  registry.register({
    intent: "CARD_BLOCK",
    language: "ru",
    requiresConfirmation: true,
    patterns: [/заблокировать карту/],
  });
  registry.register({
    intent: "CARD_BLOCK",
    language: "en",
    requiresConfirmation: true,
    patterns: [/block.*card/],
  });
  registry.register({
    intent: "CARD_SERVICE",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/\bkarta/],
  });
  registry.register({
    intent: "CARD_SERVICE",
    language: "en",
    requiresConfirmation: false,
    patterns: [/\bcard\b/],
  });

  // --- TRANSFER -----------------------------------------------------------------------
  registry.register({
    intent: "TRANSFER",
    language: "uz",
    requiresConfirmation: true,
    patterns: [/o'tkaz/, /otkaz/],
  });
  registry.register({
    intent: "TRANSFER",
    language: "ru",
    requiresConfirmation: true,
    patterns: [/перевести/, /перевод/],
  });
  registry.register({
    intent: "TRANSFER",
    language: "en",
    requiresConfirmation: true,
    // Requires a nearby amount so a bare mention of the word "transfer" — e.g. inside an
    // attempted instruction override — never resolves to an actioned money-movement intent.
    patterns: [/\btransfer\b.{0,20}\d/, /\d.{0,20}\btransfer\b/],
  });

  // --- HUMAN_ESCALATION -----------------------------------------------------------------
  registry.register({
    intent: "HUMAN_ESCALATION",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/operator/],
  });
  registry.register({
    intent: "HUMAN_ESCALATION",
    language: "ru",
    requiresConfirmation: false,
    patterns: [/оператор/],
  });
  registry.register({
    intent: "HUMAN_ESCALATION",
    language: "en",
    requiresConfirmation: false,
    patterns: [/talk to (a )?(human|person|operator|representative)/],
  });

  // --- CUSTOMER_SUPPORT ------------------------------------------------------------------
  registry.register({
    intent: "CUSTOMER_SUPPORT",
    language: "uz",
    requiresConfirmation: false,
    patterns: [/shikoyat/, /muammo/],
  });
  registry.register({
    intent: "CUSTOMER_SUPPORT",
    language: "ru",
    requiresConfirmation: false,
    patterns: [/жалоба/, /проблема/],
  });
  registry.register({
    intent: "CUSTOMER_SUPPORT",
    language: "en",
    requiresConfirmation: false,
    patterns: [/complaint/, /issue with/],
  });

  return registry;
}

/** Rough heuristic for the UNKNOWN case, where no pattern matched at all. */
export function detectLanguageHeuristic(text: string): "uz" | "ru" | "en" {
  if (/[а-яё]/i.test(text)) return "ru";
  if (/[o'g'sh']|[a-z]/i.test(text) && /\b(bo'l|lar|ning|dan|ga|ni)\b/i.test(text)) return "uz";
  return "en";
}
