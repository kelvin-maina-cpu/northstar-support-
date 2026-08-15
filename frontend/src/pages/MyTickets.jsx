import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import { getTickets } from "../services/tickets";

export default function MyTickets() {
  const { openModal } = useModal();
  const [tickets, setTickets] = useState(getTickets);

  useEffect(() => {
    const refreshTickets = () => setTickets(getTickets());
    window.addEventListener("northstar-tickets-updated", refreshTickets);
    return () => window.removeEventListener("northstar-tickets-updated", refreshTickets);
  }, []);

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
          {tickets.map((ticket) => (
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

        <p className="hint-text">New support requests are saved to this browser and appear here immediately.</p>
      </div>
    </section>
  );
}
