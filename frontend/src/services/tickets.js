const STORAGE_KEY = "northstar-tickets";

const STARTER_TICKETS = [
  { id: "001", issue: "Order Status", order: "NS-1001", created: "10 Aug 2026", status: "Resolved", statusClass: "status-resolved" },
  { id: "002", issue: "Refund Request", order: "NS-1005", created: "11 Aug 2026", status: "In Progress", statusClass: "status-in-progress" },
  { id: "003", issue: "Return Not Received by Carrier", order: "NS-1006", created: "12 Aug 2026", status: "Open", statusClass: "status-open" },
];

function readTickets() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : STARTER_TICKETS;
  } catch {
    return STARTER_TICKETS;
  }
}

export function getTickets() {
  return readTickets();
}

export function createTicket(message) {
  const tickets = readTickets();
  const nextId = String(Math.max(0, ...tickets.map((ticket) => Number(ticket.id) || 0)) + 1).padStart(3, "0");
  const orderMatch = message.match(/NS-?\d{4,6}/i);
  const ticket = {
    id: nextId,
    issue: message.trim().slice(0, 72) || "Support request",
    order: orderMatch ? orderMatch[0].toUpperCase().replace(/^NS-?/, "NS-") : "Not provided",
    created: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
    status: "Open",
    statusClass: "status-open",
  };

  const updated = [ticket, ...tickets];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("northstar-tickets-updated"));
  return ticket;
}
