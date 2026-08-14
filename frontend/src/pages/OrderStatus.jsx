import { Link } from "react-router-dom";
import { useState } from "react";

// Future: Replace sample order data with an API call to the order lookup service.
const SAMPLE_ORDERS = {
  NS12345: {
    status: "Shipped",
    statusClass: "status-shipped",
    delivery: "15 Aug 2026",
    timeline: [
      { title: "Order Placed", desc: "10 Aug 2026", state: "complete", icon: "check" },
      { title: "Shipped", desc: "12 Aug 2026 - Package has left the facility.", state: "current", icon: "local_shipping" },
      { title: "Out for Delivery", desc: "", state: "upcoming", icon: "" },
    ],
  },
  NS10000: {
    status: "Delivered",
    statusClass: "status-delivered",
    delivery: "5 Aug 2026",
    timeline: [
      { title: "Order Placed", desc: "1 Aug 2026", state: "complete", icon: "check" },
      { title: "Shipped", desc: "2 Aug 2026 - Package has left the facility.", state: "complete", icon: "local_shipping" },
      { title: "Delivered", desc: "5 Aug 2026 - Left at front door.", state: "complete", icon: "task_alt" },
    ],
  },
  NS20000: {
    status: "Processing",
    statusClass: "status-open",
    delivery: "Pending",
    timeline: [
      { title: "Order Placed", desc: "13 Aug 2026", state: "complete", icon: "check" },
      { title: "Processing", desc: "Preparing your items for shipment.", state: "current", icon: "inventory_2" },
      { title: "Shipped", desc: "", state: "upcoming", icon: "" },
    ],
  },
};

const ORDER_NUMBER_PATTERN = /^NS\d{4,6}$/i;

export default function OrderStatus() {
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  // phase: "idle" | "loading" | "found" | "not-found"
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const raw = orderNumber.trim();

    setPhase("idle");
    setError("");

    if (!raw) {
      setError("Please enter an order number.");
      return;
    }

    if (!ORDER_NUMBER_PATTERN.test(raw)) {
      setError("Order numbers look like NS12345.");
      return;
    }

    const normalized = raw.toUpperCase();
    setPhase("loading");

    // Future: Replace this timeout with a real API request to the order service.
    setTimeout(() => {
      const order = SAMPLE_ORDERS[normalized];
      if (!order) {
        setPhase("not-found");
        return;
      }
      setResult({ id: normalized, ...order });
      setPhase("found");
    }, 700);
  }

  return (
    <section className="page-section">
      <div className="page-section-inner narrow">
        <Link to="/" className="back-link">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to Home
        </Link>

        <div className="page-heading">
          <h1>Check Order Status</h1>
          <p>Enter your order number to track your shipment.</p>
        </div>

        <div className="card form-card">
          <form noValidate onSubmit={handleSubmit}>
            <div className={`form-field${error ? " invalid" : ""}`}>
              <label htmlFor="orderNumber">Order Number</label>
              <input
                type="text"
                id="orderNumber"
                name="orderNumber"
                placeholder="e.g. NS1024"
                autoComplete="off"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
              <span className="form-error">{error}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              <span className="material-symbols-outlined" aria-hidden="true">search</span>
              <span>Check Status</span>
            </button>
          </form>
        </div>

        {phase === "loading" && (
          <div className="loading-state">
            <span className="spinner" aria-hidden="true"></span>
            <p>Looking up your order&hellip;</p>
          </div>
        )}

        {phase === "not-found" && (
          <div className="error-banner">
            <span className="material-symbols-outlined" aria-hidden="true">error</span>
            <div>
              <p className="error-banner-title">Order Not Found</p>
              <p className="error-banner-desc">We couldn't find that order. Please check your order number and try again.</p>
            </div>
          </div>
        )}

        {phase === "found" && result && (
          <div className="card result-card">
            <div className="result-card-header">
              <h2>Order: {result.id}</h2>
              <span className={`status-pill ${result.statusClass}`}>{result.status}</span>
            </div>
            <div className="result-card-body">
              <div className="result-grid">
                <div>
                  <span className="result-label">Status</span>
                  <span className="result-value">{result.status}</span>
                </div>
                <div>
                  <span className="result-label">Expected Delivery</span>
                  <span className="result-value">{result.delivery}</span>
                </div>
              </div>

              <ul className="timeline">
                {result.timeline.map((step) => (
                  <li key={step.title} className={`timeline-item ${step.state}`}>
                    <div className="timeline-marker">
                      {step.icon && (
                        <span className="material-symbols-outlined" aria-hidden="true">{step.icon}</span>
                      )}
                    </div>
                    <div>
                      <p className="timeline-title">{step.title}</p>
                      {step.desc && <p className="timeline-desc">{step.desc}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <p className="hint-text">
          Try a sample order number: <strong>NS12345</strong> (shipped), <strong>NS10000</strong> (delivered), or <strong>NS20000</strong> (processing).
        </p>
      </div>
    </section>
  );
}
