import { Link } from "react-router-dom";
import { useModal } from "../context/ModalContext";

// Future: Replace sample ticket data with an API call to the support ticketing system.
const TICKETS = [
  { id: "001", issue: "Order Status", order: "NS12345", created: "10 Aug 2026", status: "Resolved", statusClass: "status-resolved" },
  { id: "002", issue: "Refund Request", order: "NS12089", created: "11 Aug 2026", status: "In Progress", statusClass: "status-in-progress" },
  { id: "003", issue: "Return Not Received by Carrier", order: "NS11876", created: "12 Aug 2026", status: "Open", statusClass: "status-open" },
  { id: "004", issue: "Wrong Item Delivered", order: "NS10992", created: "3 Aug 2026", status: "Closed", statusClass: "status-closed" },
  { id: "005", issue: "Order Status", order: "NS10521", created: "29 Jul 2026", status: "Resolved", statusClass: "status-resolved" },
];

export default function MyTickets() {
  const { openModal } = useModal();

  return (
    <section className="page-section">
      <div className="page-section-inner">
        <Link to="/" className="back-link">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to Home
        </Link>

        <div className="page-heading-row">
          <div className="page-heading">
            <h1>My Tickets</h1>
            <p>Track the status of your support requests below.</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => openModal("contact")}>
            <span className="material-symbols-outlined" aria-hidden="true">add</span>
            New Ticket
          </button>
        </div>

        <div className="ticket-list">
          {TICKETS.map((ticket) => (
            <article className="ticket-card" key={ticket.id}>
              <div className="ticket-card-main">
                <p className="ticket-id">Ticket #{ticket.id}</p>
                <h2 className="ticket-issue">{ticket.issue}</h2>
                <p className="ticket-meta">Order {ticket.order} &middot; Created {ticket.created}</p>
              </div>
              <span className={`status-pill ${ticket.statusClass}`}>{ticket.status}</span>
            </article>
          ))}
        </div>

        <p className="hint-text">
          This is sample demo data. Live ticket syncing will be available once the backend is connected.
        </p>
      </div>
    </section>
  );
}
