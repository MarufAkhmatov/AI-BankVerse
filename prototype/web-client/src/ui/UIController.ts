// Contextual UI only — docs/08_UI_UX_SYSTEM.md ("UI must appear only when needed. Avoid
// permanent large menus"). Every panel here mounts for one interaction and unmounts after.

function el<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing element #${id}`);
  return found as T;
}

export interface ConfirmationData {
  provider: string;
  amount: number;
  currency: string;
  customerName: string;
}

export interface ReceiptData {
  transactionId: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  date: string;
}

export class UIController {
  private readonly conversationPanel = el<HTMLDivElement>("conversation-panel");
  private readonly servicePanel = el<HTMLDivElement>("service-panel");
  private readonly receiptPanel = el<HTMLDivElement>("receipt-panel");
  private readonly interactionPrompt = el<HTMLDivElement>("interaction-prompt");
  private readonly micIndicator = el<HTMLDivElement>("mic-indicator");
  private readonly loadingScreen = el<HTMLDivElement>("loading-screen");

  hideLoadingScreen(): void {
    this.loadingScreen.classList.add("hidden");
  }

  setInteractionPrompt(text: string | null): void {
    if (!text) {
      this.interactionPrompt.classList.add("hidden");
      return;
    }
    this.interactionPrompt.textContent = text;
    this.interactionPrompt.classList.remove("hidden");
  }

  setMicListening(active: boolean): void {
    this.micIndicator.classList.toggle("hidden", !active);
  }

  showConversation(agentName: string, text: string): void {
    this.conversationPanel.innerHTML = "";
    const nameEl = document.createElement("div");
    nameEl.className = "agent-name";
    nameEl.textContent = agentName;
    const textEl = document.createElement("div");
    textEl.className = "agent-text";
    textEl.textContent = text;
    this.conversationPanel.append(nameEl, textEl);
    this.conversationPanel.classList.remove("hidden");
  }

  hideConversation(): void {
    this.conversationPanel.classList.add("hidden");
  }

  showConfirmation(data: ConfirmationData, agentText: string, onConfirm: () => void, onCancel: () => void): void {
    this.servicePanel.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = `${capitalize(data.provider)} Payment`;
    this.servicePanel.appendChild(title);

    const agentLine = document.createElement("div");
    agentLine.className = "agent-text";
    agentLine.textContent = agentText;
    this.servicePanel.appendChild(agentLine);

    this.servicePanel.appendChild(row("Customer", data.customerName));
    this.servicePanel.appendChild(row("Amount", `${data.amount.toLocaleString("en-US")} ${data.currency}`));

    const actions = document.createElement("div");
    actions.className = "actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "secondary";
    cancelBtn.textContent = "Bekor qilish";
    cancelBtn.onclick = onCancel;

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Tasdiqlash";
    confirmBtn.onclick = onConfirm;

    actions.append(cancelBtn, confirmBtn);
    this.servicePanel.appendChild(actions);
    this.servicePanel.classList.remove("hidden");
  }

  hideConfirmation(): void {
    this.servicePanel.classList.add("hidden");
  }

  showReceipt(data: ReceiptData, onClose: () => void): void {
    this.receiptPanel.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = "To'lov cheki";
    this.receiptPanel.appendChild(title);

    this.receiptPanel.appendChild(row("Xizmat", capitalize(data.provider)));
    this.receiptPanel.appendChild(row("Summa", `${data.amount.toLocaleString("en-US")} ${data.currency}`));
    this.receiptPanel.appendChild(row("Holat", data.status));
    this.receiptPanel.appendChild(row("Tranzaksiya ID", data.transactionId));
    this.receiptPanel.appendChild(row("Sana", new Date(data.date).toLocaleString()));

    const actions = document.createElement("div");
    actions.className = "actions";
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Yopish";
    closeBtn.onclick = onClose;
    actions.appendChild(closeBtn);
    this.receiptPanel.appendChild(actions);

    this.receiptPanel.classList.remove("hidden");
  }

  hideReceipt(): void {
    this.receiptPanel.classList.add("hidden");
  }
}

function row(label: string, value: string): HTMLDivElement {
  const rowEl = document.createElement("div");
  rowEl.className = "row";
  const labelEl = document.createElement("span");
  labelEl.className = "label";
  labelEl.textContent = label;
  const valueEl = document.createElement("span");
  valueEl.textContent = value;
  rowEl.append(labelEl, valueEl);
  return rowEl;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
