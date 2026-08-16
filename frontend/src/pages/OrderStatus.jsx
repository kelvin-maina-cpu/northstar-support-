import { Link } from "react-router-dom";
import { useState } from "react";

const ORDER_NUMBER_PATTERN = /^NS-?\d{4,6}$/i;
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function statusToClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'shipped':
      return 'status-shipped';
    case 'delivered':
      return 'status-delivered';
    case 'processing':
      return 'status-open';
    case 'delayed':
      return 'status-delayed';
    default:
      return 'status-open';
  }
}

export default function OrderStatus() {
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  // phase: "idle" | "loading" | "found" | "not-found" | "error"
  const [phase, setPhase] = useState("idle");
  const [result, setResult] = useState(null);

  function selectDemoOrder(orderId) {
    setOrderNumber(orderId);
    setError("");
    setResult(null);
    setPhase("idle");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const raw = orderNumber.trim();

    setPhase("idle");
    setError("");

    if (!raw) {
      setError("Please enter an order number.");
      return;
    }

    if (!ORDER_NUMBER_PATTERN.test(raw)) {
      setError("Order numbers look like NS-1001.");
      return;
    }

    const normalized = raw.toUpperCase().replace(/^NS-?/, "NS-");
    setPhase("loading");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(normalized)}`, { signal: controller.signal });

      if (res.status === 404) {
        setPhase('not-found');
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      const data = await res.json();

      setResult({
        id: data.orderId || normalized,
        status: data.status || 'Unknown',
        statusClass: statusToClass(data.status),
        delivery: data.expectedDelivery || 'Pending',
        timeline: [],
      });

      setPhase('found');
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(err.message || 'Network error');
      }
      setPhase('error');
    } finally {
      clearTimeout(timeout);
    }
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
                placeholder="e.g. NS-1001"
                autoComplete="off"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
              <span className="form-error">{error}</span>
              <div className="demo-orders" aria-label="Demo order IDs available for testing">
                <span className="demo-orders-label">Demo order IDs:</span>
                <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1001")}>NS-1001 <span>shipped</span></button>
                <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1002")}>NS-1002 <span>processing</span></button>
                <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1003")}>NS-1003 <span>delivered</span></button>
                <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1004")}>NS-1004 <span>delayed</span></button>
              </div>
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

        {phase === "error" && (
          <div className="error-banner">
            <span className="material-symbols-outlined" aria-hidden="true">error</span>
            <div>
              <p className="error-banner-title">Lookup Failed</p>
              <p className="error-banner-desc">{error || 'Something went wrong while contacting the server.'}</p>
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
      </div>
    </section>
  );
}
