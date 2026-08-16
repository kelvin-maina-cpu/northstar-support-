import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function ReturnsRefunds() {
  // Item 1 ("How do I return an item?") is expanded by default, matching
  // the original's aria-expanded="true" on accordionTrigger1.
  const [openItem, setOpenItem] = useState(1);
  const [lookupOrder, setLookupOrder] = useState("");
  const [lookupPhase, setLookupPhase] = useState("idle");
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [values, setValues] = useState({ orderNumber: "", reason: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  function toggleItem(index) {
    setOpenItem((current) => (current === index ? null : index));
  }

  function resetReturnForm() {
    setValues({ orderNumber: "", reason: "" });
    setErrors({});
    setSubmitted(false);
  }

  function closeReturnModal() {
    setReturnModalOpen(false);
    resetReturnForm();
  }

  function selectDemoOrder(orderId) {
    setLookupOrder(orderId);
    setLookupError("");
    setLookupResult(null);
    setLookupPhase("idle");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!values.orderNumber.trim()) next.orderNumber = "Please enter your order number.";
    if (!values.reason.trim()) next.reason = "Please tell us why you're returning this item.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Future: Replace with a real API call to the returns service.
    setSubmitted(true);
    showToast("Your return request has been started.");

    setTimeout(() => {
      closeReturnModal();
    }, 2500);
  }

  return (
    <section className="page-section">
      <div className="page-section-inner narrow">
        <Link to="/" className="back-link">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to Home
        </Link>

        <div className="page-heading">
          <h1>Returns &amp; Refunds</h1>
          <p>Find answers to common questions about returning items and receiving refunds.</p>
        </div>

        <div className="accordion">
          <div className="card form-card">
            <form
              className="lookup-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const raw = lookupOrder.trim();
                setLookupError("");
                setLookupResult(null);

                if (!raw) {
                  setLookupError('Please enter an order number.');
                  return;
                }

                setLookupPhase('loading');
                const id = raw.toUpperCase();
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);

                try {
                  const res = await fetch(`${API_BASE_URL}/api/returns/${encodeURIComponent(id)}`, { signal: controller.signal });
                  if (res.status === 404) {
                    setLookupPhase('not-found');
                    return;
                  }
                  if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                  }
                  const data = await res.json();
                  setLookupResult(data);
                  setLookupPhase('found');
                } catch (err) {
                  if (err.name === 'AbortError') setLookupError('Request timed out.');
                  else setLookupError(err.message || 'Network error');
                  setLookupPhase('error');
                } finally {
                  clearTimeout(timeout);
                }
              }}
            >
              <div className={`form-field${lookupError ? ' invalid' : ''}`}>
                <label htmlFor="lookupOrder">Check return eligibility</label>
                <input id="lookupOrder" placeholder="e.g. NS1024" value={lookupOrder} onChange={(e) => setLookupOrder(e.target.value)} />
                <span className="form-error">{lookupError}</span>
                <div className="demo-orders" aria-label="Demo order IDs available for testing">
                  <span className="demo-orders-label">Demo order IDs:</span>
                  <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1003")}>NS-1003 <span>eligible</span></button>
                  <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1001")}>NS-1001 <span>still shipping</span></button>
                  <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1005")}>NS-1005 <span>return in transit</span></button>
                  <button type="button" className="demo-order" onClick={() => selectDemoOrder("NS-1006")}>NS-1006 <span>refund complete</span></button>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" type="submit">Check</button>
              </div>
            </form>

            {lookupPhase === 'loading' && (
              <div className="loading-state"><span className="spinner" aria-hidden="true"></span><p>Checking return eligibility&hellip;</p></div>
            )}

            {lookupPhase === 'not-found' && (
              <div className="error-banner"><p>Order not found.</p></div>
            )}

            {lookupPhase === 'error' && (
              <div className="error-banner"><p>{lookupError}</p></div>
            )}

            {lookupPhase === 'found' && lookupResult && (
              <div className="card result-card">
                <div className="result-card-header">
                  <h2>Order: {lookupResult.orderId}</h2>
                  <span className={`status-pill ${lookupResult.eligible ? 'status-open' : 'status-delayed'}`}>{lookupResult.eligible ? 'Eligible' : 'Not eligible'}</span>
                </div>
                <div className="result-card-body">
                  <div className="result-grid">
                    <div>
                      <span className="result-label">Return Status</span>
                      <span className="result-value">{lookupResult.returnStatus}</span>
                    </div>
                    <div>
                      <span className="result-label">Refund Status</span>
                      <span className="result-value">{lookupResult.refundStatus || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="accordion-item">
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={openItem === 1}
              onClick={() => toggleItem(1)}
            >
              <span>How do I return an item?</span>
              <span className="material-symbols-outlined accordion-icon" aria-hidden="true">
                {openItem === 1 ? "expand_less" : "expand_more"}
              </span>
            </button>
            <div className="accordion-panel" hidden={openItem !== 1}>
              <ol className="steps-list">
                <li><strong>Enter order number:</strong> Locate your order number from your confirmation email or dashboard and enter it in the returns portal.</li>
                <li><strong>Confirm item:</strong> Select the specific item(s) you wish to return from the order list and provide a brief reason.</li>
                <li><strong>Follow instructions:</strong> Print the provided shipping label, package your item securely, and drop it off at the designated carrier.</li>
              </ol>
              <button type="button" className="btn btn-primary" onClick={() => setReturnModalOpen(true)}>Start a Return</button>
            </div>
          </div>

          <div className="accordion-item">
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={openItem === 2}
              onClick={() => toggleItem(2)}
            >
              <span>When will I receive my refund?</span>
              <span className="material-symbols-outlined accordion-icon" aria-hidden="true">
                {openItem === 2 ? "expand_less" : "expand_more"}
              </span>
            </button>
            <div className="accordion-panel" hidden={openItem !== 2}>
              <p>Once we receive and inspect your returned item, refunds are issued to your original payment method within <strong>5-10 business days</strong>. You'll receive an email confirmation as soon as your refund is processed.</p>
              <p>Refunds for store credit are typically available within 24 hours of inspection instead.</p>
            </div>
          </div>

          <div className="accordion-item">
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={openItem === 3}
              onClick={() => toggleItem(3)}
            >
              <span>What is the return policy?</span>
              <span className="material-symbols-outlined accordion-icon" aria-hidden="true">
                {openItem === 3 ? "expand_less" : "expand_more"}
              </span>
            </button>
            <div className="accordion-panel" hidden={openItem !== 3}>
              <ul className="bullet-list">
                <li>Items can be returned within <strong>30 days</strong> of delivery.</li>
                <li>Items must be unused, unworn, and in their original packaging with tags attached.</li>
                <li>Final sale and clearance items are not eligible for return.</li>
                <li>Gift cards and digital products are non-refundable.</li>
                <li>Return shipping is free for defective or incorrect items; a shipping fee may apply for other returns.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Modal id="startReturnModal" open={returnModalOpen} onClose={closeReturnModal} labelledBy="startReturnModalTitle">
        <div className="modal-header">
          <h2 id="startReturnModalTitle">Start a Return</h2>
          <button type="button" className="modal-close" aria-label="Close start a return form" onClick={closeReturnModal}>
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <form className="modal-body" noValidate onSubmit={handleSubmit} hidden={submitted}>
          <div className={`form-field${errors.orderNumber ? " invalid" : ""}`}>
            <label htmlFor="returnOrderNumber">Order Number</label>
            <input
              type="text"
              id="returnOrderNumber"
              placeholder="e.g. NS1024"
              required
              value={values.orderNumber}
              onChange={(e) => setValues((v) => ({ ...v, orderNumber: e.target.value }))}
            />
            <span className="form-error">{errors.orderNumber}</span>
          </div>

          <div className={`form-field${errors.reason ? " invalid" : ""}`}>
            <label htmlFor="returnReason">Reason for Return</label>
            <textarea
              id="returnReason"
              rows="3"
              placeholder="e.g. Wrong size, changed my mind, item arrived damaged..."
              required
              value={values.reason}
              onChange={(e) => setValues((v) => ({ ...v, reason: e.target.value }))}
            />
            <span className="form-error">{errors.reason}</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={closeReturnModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit Return</button>
          </div>
        </form>

        {submitted && (
          <div className="modal-body">
            <div className="form-success">
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
              <p>Your return request has been started. A prepaid shipping label will be emailed to you shortly.</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
