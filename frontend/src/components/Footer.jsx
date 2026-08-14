import { useToast } from "../context/ToastContext";

const FOOTER_MESSAGES = {
  privacy: "Privacy Policy page is coming soon.",
  terms: "Terms of Service page is coming soon.",
  accessibility: "Accessibility statement is coming soon.",
  status: "Status page is coming soon.",
};

export default function Footer() {
  const { showToast } = useToast();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-name">Northstar Support</span>
          <span className="footer-copy">© 2026 Northstar Support. All rights reserved.</span>
        </div>
        <nav className="footer-links" aria-label="Footer">
          {Object.entries(FOOTER_MESSAGES).map(([key, message]) => (
            <button
              key={key}
              type="button"
              className="footer-link footer-link-btn"
              onClick={() => showToast(message)}
            >
              {key === "privacy" && "Privacy Policy"}
              {key === "terms" && "Terms of Service"}
              {key === "accessibility" && "Accessibility"}
              {key === "status" && "Status Page"}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  );
}
