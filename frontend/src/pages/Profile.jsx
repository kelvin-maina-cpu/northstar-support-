import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useModal } from "../context/ModalContext";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Profile() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { profile, setProfile, initials } = useProfile();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const isDark = theme === "dark";

  // Demo-only preference toggles (email / SMS notifications) — matches
  // the original's non-persisted, purely local UI state.
  const [emailPref, setEmailPref] = useState(true);
  const [smsPref, setSmsPref] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [values, setValues] = useState(profile);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function openEdit() {
    setValues(profile); // pre-fill with current values
    setErrors({});
    setSubmitted(false);
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
    setErrors({});
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!values.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = "Please enter a valid email address.";
    if (!values.phone.trim()) next.phone = "Please enter your phone number.";
    if (!values.address.trim()) next.address = "Please enter your shipping address.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Future: Replace with a real API call to update the customer profile.
    setProfile({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      address: values.address.trim(),
    });
    setSubmitted(true);
    showToast("Your profile has been updated.");

    setTimeout(() => {
      closeEdit();
    }, 2000);
  }

  return (
    <section className="page-section">
      <div className="page-section-inner narrow">
        <Link to="/" className="back-link">
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          Back to Home
        </Link>

        <div className="page-heading">
          <h1>Profile</h1>
          <p>This is sample demo data. Account management will be available once the backend is connected.</p>
        </div>

        <div className="card profile-summary-card">
          <span className="profile-avatar xlarge" aria-hidden="true">{initials}</span>
          <div className="profile-summary-details">
            <h2 className="profile-summary-name">{profile.fullName}</h2>
            <p className="profile-summary-email">{profile.email}</p>
            <span className="demo-badge">Demo Account</span>
          </div>
          <button type="button" className="btn btn-secondary edit-profile-btn" onClick={openEdit}>
            <span className="material-symbols-outlined" aria-hidden="true">edit</span>
            Edit Profile
          </button>
        </div>

        <div className="card info-card">
          <h3 className="info-card-title">Account Information</h3>
          <dl className="info-grid">
            <div className="info-row">
              <dt>Full Name</dt>
              <dd>{profile.fullName}</dd>
            </div>
            <div className="info-row">
              <dt>Email Address</dt>
              <dd>{profile.email}</dd>
            </div>
            <div className="info-row">
              <dt>Phone Number</dt>
              <dd>{profile.phone}</dd>
            </div>
            <div className="info-row">
              <dt>Shipping Address</dt>
              <dd>{profile.address}</dd>
            </div>
            <div className="info-row">
              <dt>Customer Since</dt>
              <dd>March 2022</dd>
            </div>
          </dl>
        </div>

        <div className="card info-card">
          <h3 className="info-card-title">Account Preferences</h3>
          <div className="preference-row">
            <div>
              <p className="preference-label">Email Notifications</p>
              <p className="preference-desc">Get updates about your orders, returns, and refunds.</p>
            </div>
            <button
              type="button"
              className="theme-switch"
              role="switch"
              aria-checked={emailPref}
              aria-label="Toggle email notifications"
              onClick={() => setEmailPref((v) => !v)}
            >
              <span className="theme-switch-thumb"></span>
            </button>
          </div>
          <div className="preference-row">
            <div>
              <p className="preference-label">SMS Notifications</p>
              <p className="preference-desc">Receive text alerts for shipping updates.</p>
            </div>
            <button
              type="button"
              className="theme-switch"
              role="switch"
              aria-checked={smsPref}
              aria-label="Toggle SMS notifications"
              onClick={() => setSmsPref((v) => !v)}
            >
              <span className="theme-switch-thumb"></span>
            </button>
          </div>
          <div className="preference-row">
            <div>
              <p className="preference-label">Dark Mode</p>
              <p className="preference-desc">Switch between light and dark appearance.</p>
            </div>
            <button
              type="button"
              className="theme-switch"
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
            >
              <span className="theme-switch-thumb"></span>
            </button>
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/my-tickets")}>
            <span className="material-symbols-outlined" aria-hidden="true">confirmation_number</span>
            View My Tickets
          </button>
          <button type="button" className="btn btn-secondary danger" onClick={() => openModal("signout")}>
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      <Modal id="editProfileModal" open={editOpen} onClose={closeEdit} labelledBy="editProfileModalTitle">
        <div className="modal-header">
          <h2 id="editProfileModalTitle">Edit Profile</h2>
          <button type="button" className="modal-close" aria-label="Close edit profile form" onClick={closeEdit}>
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        <form className="modal-body" noValidate onSubmit={handleSubmit} hidden={submitted}>
          <div className={`form-field${errors.fullName ? " invalid" : ""}`}>
            <label htmlFor="editFullName">Full Name</label>
            <input
              type="text"
              id="editFullName"
              required
              value={values.fullName}
              onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
            />
            <span className="form-error">{errors.fullName}</span>
          </div>

          <div className={`form-field${errors.email ? " invalid" : ""}`}>
            <label htmlFor="editEmail">Email Address</label>
            <input
              type="email"
              id="editEmail"
              required
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            />
            <span className="form-error">{errors.email}</span>
          </div>

          <div className={`form-field${errors.phone ? " invalid" : ""}`}>
            <label htmlFor="editPhone">Phone Number</label>
            <input
              type="tel"
              id="editPhone"
              placeholder="e.g. (555) 123-4567"
              required
              value={values.phone}
              onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            />
            <span className="form-error">{errors.phone}</span>
          </div>

          <div className={`form-field${errors.address ? " invalid" : ""}`}>
            <label htmlFor="editAddress">Shipping Address</label>
            <textarea
              id="editAddress"
              rows="3"
              required
              value={values.address}
              onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))}
            />
            <span className="form-error">{errors.address}</span>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>

        {submitted && (
          <div className="modal-body">
            <div className="form-success">
              <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
              <p>Your profile has been updated.</p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
