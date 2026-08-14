import { useState } from "react";
import Modal from "./Modal";
import { useModal } from "../context/ModalContext";
import { useToast } from "../context/ToastContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactModal() {
  const { activeModal, closeModal } = useModal();
  const { showToast } = useToast();
  const open = activeModal === "contact";

  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function reset() {
    setValues({ name: "", email: "", message: "" });
    setErrors({});
    setSubmitted(false);
  }

  function handleClose() {
    closeModal();
    reset();
  }

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (!values.message.trim()) next.message = "Please enter a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    // Future: Replace with a real API call to submit the support request.
    setSubmitted(true);
    showToast("Your message has been sent to support.");

    setTimeout(() => {
      closeModal();
      reset();
    }, 2000);
  }

  return (
    <Modal id="contactModal" open={open} onClose={handleClose} labelledBy="contactModalTitle">
      <div className="modal-header">
        <h2 id="contactModalTitle">Contact Support</h2>
        <button type="button" className="modal-close" aria-label="Close contact form" onClick={handleClose}>
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </div>

      <form className="modal-body" noValidate onSubmit={handleSubmit} hidden={submitted}>
        <div className={`form-field${errors.name ? " invalid" : ""}`}>
          <label htmlFor="contactName">Name</label>
          <input
            type="text"
            id="contactName"
            name="name"
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
          <span className="form-error">{errors.name}</span>
        </div>

        <div className={`form-field${errors.email ? " invalid" : ""}`}>
          <label htmlFor="contactEmail">Email</label>
          <input
            type="email"
            id="contactEmail"
            name="email"
            required
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
          <span className="form-error">{errors.email}</span>
        </div>

        <div className={`form-field${errors.message ? " invalid" : ""}`}>
          <label htmlFor="contactMessage">Message</label>
          <textarea
            id="contactMessage"
            name="message"
            rows="4"
            required
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          />
          <span className="form-error">{errors.message}</span>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Send Message</button>
        </div>
      </form>

      {submitted && (
        <div className="modal-body">
          <div className="form-success">
            <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
            <p>Thanks for reaching out! Our support team will get back to you shortly.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
