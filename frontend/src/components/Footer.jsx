import { Link } from "react-router-dom";
import { useModal } from "../context/ModalContext";

export default function Footer() {
  const { openModal } = useModal();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-name">Northstar Support</span>
          <span className="footer-copy">© 2026 Northstar Support. All rights reserved.</span>
        </div>
        <nav className="footer-links" aria-label="Support shortcuts">
          <Link to="/order-status" className="footer-link">Track an Order</Link>
          <Link to="/returns-refunds" className="footer-link">Returns &amp; Refunds</Link>
          <Link to="/my-tickets" className="footer-link">My Tickets</Link>
          <button type="button" className="footer-link footer-link-btn" onClick={() => openModal("contact")}>Contact Support</button>
        </nav>
      </div>
    </footer>
  );
}
