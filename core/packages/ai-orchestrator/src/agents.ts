// Default agent roster for the vertical slice — docs/64_AI_AGENT_ROSTER.md.
// Adding a department = one more registry entry here, nothing else changes.

import { AgentRegistry } from "@bankverse/domain";

export function buildDefaultAgentRegistry(): AgentRegistry {
  const registry = new AgentRegistry();

  registry.register({
    agentId: "reception",
    name: "Reception",
    role: "Receptionist",
    department: "reception",
    handledIntents: ["UNKNOWN", "HUMAN_ESCALATION", "CUSTOMER_SUPPORT", "ACCOUNT_BALANCE", "TRANSACTION_HISTORY", "FX"],
  });
  registry.register({
    agentId: "payment",
    name: "Aziza",
    role: "Payment Specialist",
    department: "payments",
    handledIntents: ["UTILITY_PAYMENT", "TRANSFER", "CARD_SERVICE", "CARD_BLOCK", "CARD_REPLACEMENT"],
  });
  registry.register({
    agentId: "credit",
    name: "Aziza Karimova",
    role: "Credit Specialist",
    department: "credit",
    handledIntents: ["CREDIT_INFORMATION", "CREDIT_APPLICATION"],
  });
  registry.register({
    agentId: "deposit",
    name: "Deposit Agent",
    role: "Deposit Specialist",
    department: "deposits",
    handledIntents: ["DEPOSIT_INFORMATION", "DEPOSIT_OPENING"],
  });
  return registry;
}
