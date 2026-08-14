import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../context/ModalContext";

const KB_ARTICLES = [
  {
    title: "How to track your order",
    description: "Find your order number and check real-time shipping status.",
    icon: "package_2",
    keywords: ["order", "tracking", "track", "shipment", "package", "where is my order"],
    target: "/order-status",
  },
  {
    title: "Shipping timeframes",
    description: "Standard and expedited shipping usually take 3-7 business days.",
    icon: "local_shipping",
    keywords: ["shipping", "delivery", "arrive", "when will my order arrive", "eta"],
    target: "/order-status",
  },
  {
    title: "How do I return an item?",
    description: "Step-by-step instructions for starting a return.",
    icon: "assignment_return",
    keywords: ["return", "returns", "send back", "exchange"],
    target: "/returns-refunds",
  },
  {
    title: "When will I receive my refund?",
    description: "Refunds are typically processed within 5-10 business days.",
    icon: "payments",
    keywords: ["refund", "refunds", "money back", "reimburse"],
    target: "/returns-refunds",
  },
  {
    title: "Return policy overview",
    description: "Items can be returned within 30 days of delivery in original condition.",
    icon: "policy",
    keywords: ["policy", "return policy", "rules", "eligibility"],
    target: "/returns-refunds",
  },
  {
    title: "Contact customer support",
    description: "Reach our support team directly for anything not covered here.",
    icon: "support_agent",
    keywords: ["contact", "support", "help", "agent", "talk to someone"],
    target: null,
  },
];

export default function Home() {
  const { openModal } = useModal();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null); // null = not searched yet

  // Scroll to #hero / #knowledgeBase when arriving via a header link from
  // another page (e.g. "/#knowledgeBase") — the original relied on native
  // anchor scrolling, which React Router doesn't do automatically.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  function runSearch(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const normalized = trimmed.toLowerCase();
    const matches = KB_ARTICLES.filter((article) =>
      article.keywords.some((k) => k.includes(normalized) || normalized.includes(k))
    );
    setResults({ query: trimmed, matches });
  }

  function closeResults() {
    setResults(null);
    setQuery("");
  }

  return (
    <div className="hero" id="hero">
      <div className="hero-heading">
        <h1>How can we help you?</h1>
        <p>Select an option below to quickly resolve your issue or check status.</p>
      </div>

      <div className="hero-cards">
        <Link to="/order-status" className="support-card">
          <span className="support-card-icon">
            <span className="material-symbols-outlined" aria-hidden="true">package_2</span>
          </span>
          <h2>Check Order Status</h2>
          <p>Track your package, view delivery details, and manage your recent orders.</p>
        </Link>

        <Link to="/returns-refunds" className="support-card">
          <span className="support-card-icon">
            <span className="material-symbols-outlined" aria-hidden="true">sync</span>
          </span>
          <h2>Returns &amp; Refunds</h2>
          <p>Start a new return, check refund status, and review our policies.</p>
        </Link>
      </div>

      <div className="kb-search" id="knowledgeBase">
        <form onSubmit={runSearch}>
          <div className="kb-search-field">
            <span className="material-symbols-outlined" aria-hidden="true">search</span>
            <input
              type="text"
              id="kbSearchInput"
              placeholder="Search knowledge base articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="kb-search-btn">Search</button>
          </div>
        </form>

        {results && (
          <div className="kb-results">
            <div className="kb-results-header">
              <p className="kb-results-summary">
                {results.matches.length === 0
                  ? `No results for "${results.query}"`
                  : `${results.matches.length} result${results.matches.length > 1 ? "s" : ""} for "${results.query}"`}
              </p>
              <button type="button" className="kb-results-close" aria-label="Clear search results" onClick={closeResults}>
                <span className="material-symbols-outlined" aria-hidden="true">close</span>
              </button>
            </div>

            <ul className="kb-results-list">
              {results.matches.length === 0 && (
                <li className="kb-no-results">Try searching for order tracking, shipping, returns, or refunds.</li>
              )}
              {results.matches.map((article) =>
                article.target ? (
                  <li key={article.title}>
                    <Link className="kb-result-item" to={article.target}>
                      <span className="kb-result-title">
                        <span className="material-symbols-outlined" aria-hidden="true">{article.icon}</span>
                        {article.title}
                      </span>
                      <span className="kb-result-desc">{article.description}</span>
                    </Link>
                  </li>
                ) : (
                  <li key={article.title}>
                    <button type="button" className="kb-result-item" onClick={() => openModal("contact")}>
                      <span className="kb-result-title">
                        <span className="material-symbols-outlined" aria-hidden="true">{article.icon}</span>
                        {article.title}
                      </span>
                      <span className="kb-result-desc">{article.description}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
