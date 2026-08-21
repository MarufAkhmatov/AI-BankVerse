// Mirrors the single demo customer in core/packages/banking-mock — docs/21_MOCK_BANKING_BACKEND.md §2.
// Deliberately duplicated as a string, not imported: the web client only ever talks to
// core/packages/api over HTTP, never to a Node-only package directly.
export const DEMO_ACCOUNT_ID = "acc_demo";
export const DEMO_USER_ID = "user_demo";
export const DEMO_CUSTOMER_NAME = "Demo Customer";

export const HALL = {
  width: 30,
  length: 50,
  ceilingHeight: 16,
} as const;
