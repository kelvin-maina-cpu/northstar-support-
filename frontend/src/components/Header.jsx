import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null); // "notifications" | "help" | "profile" | null
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const { openModal } = useModal();
  const { theme, toggleTheme } = useTheme();
  const { profile, initials } = useProfile();
  const isDark = theme === "dark";

  // Close any open dropdown on outside click or Escape — mirrors the
  // original's document-level listeners (section 3 of script.js).
  useEffect(() => {
    function onDocClick() {
      setOpenDropdown(null);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggleDropdown(name, event) {
    event.stopPropagation();
    setOpenDropdown((current) => (current === name ? null : name));
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  function goTo(path) {
    setOpenDropdown(null);
    setMobileNavOpen(false);
    navigate(path);
  }

  function openContact() {
    setOpenDropdown(null);
    setMobileNavOpen(false);
    openModal("contact");
  }

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header-inner">
        {/* Brand / Logo */}
        <Link to="/" className="brand" aria-label="Northstar Support home">
          <span className="brand-name">Northstar Support</span>
        </Link>

        {/* Primary Navigation (desktop) */}
        <nav className="primary-nav" aria-label="Primary">
          <ul>
            <li><a href="/#hero" className="nav-link">Dashboard</a></li>
            <li><Link to="/my-tickets" className="nav-link">My Tickets</Link></li>
            <li><a href="/#knowledgeBase" className="nav-link">Knowledge Base</a></li>
            <li><button type="button" className="nav-link nav-link-btn" onClick={openContact}>Contact</button></li>
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Notifications */}
          <div className="header-icon-wrap">
            <button
              type="button"
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={openDropdown === "notifications"}
              aria-label="Notifications"
              onClick={(e) => toggleDropdown("notifications", e)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
              <span className="icon-badge">3</span>
            </button>

            <div className="dropdown-panel" role="dialog" aria-label="Notifications" hidden={openDropdown !== "notifications"} onClick={stopPropagation}>
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button type="button" className="dropdown-close" aria-label="Close notifications" onClick={() => setOpenDropdown(null)}>
                  <span className="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              </div>
              <ul className="notification-list">
                <li className="notification-item">
                  <span className="material-symbols-outlined notification-icon" aria-hidden="true">local_shipping</span>
                  <div className="notification-text">
                    <p>Your order <strong>NS12345</strong> has been shipped.</p>
                    <span className="notification-time">2 hours ago</span>
                  </div>
                </li>
                <li className="notification-item">
                  <span className="material-symbols-outlined notification-icon" aria-hidden="true">sync</span>
                  <div className="notification-text">
                    <p>Your refund for order <strong>NS12089</strong> is being processed.</p>
                    <span className="notification-time">Yesterday</span>
                  </div>
                </li>
                <li className="notification-item">
                  <span className="material-symbols-outlined notification-icon" aria-hidden="true">support_agent</span>
                  <div className="notification-text">
                    <p>Your support request <strong>#001</strong> has been updated.</p>
                    <span className="notification-time">2 days ago</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Help */}
          <div className="header-icon-wrap">
            <button
              type="button"
              className="icon-btn"
              aria-haspopup="true"
              aria-expanded={openDropdown === "help"}
              aria-label="Help"
              onClick={(e) => toggleDropdown("help", e)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">help</span>
            </button>

            <div className="dropdown-panel" role="dialog" aria-label="Help" hidden={openDropdown !== "help"} onClick={stopPropagation}>
              <div className="dropdown-header">
                <h3>Help</h3>
                <button type="button" className="dropdown-close" aria-label="Close help menu" onClick={() => setOpenDropdown(null)}>
                  <span className="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
              </div>
              <ul className="help-list">
                <li>
                  <button type="button" className="help-option" onClick={() => goTo("/order-status")}>
                    <span className="material-symbols-outlined" aria-hidden="true">package_2</span>
                    Order Help
                  </button>
                </li>
                <li>
                  <button type="button" className="help-option" onClick={() => goTo("/returns-refunds")}>
                    <span className="material-symbols-outlined" aria-hidden="true">assignment_return</span>
                    Returns Help
                  </button>
                </li>
                <li>
                  <button type="button" className="help-option" onClick={() => goTo("/returns-refunds")}>
                    <span className="material-symbols-outlined" aria-hidden="true">payments</span>
                    Refund Help
                  </button>
                </li>
                <li>
                  <button type="button" className="help-option" onClick={openContact}>
                    <span className="material-symbols-outlined" aria-hidden="true">chat</span>
                    Contact Support
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Profile */}
          <div className="header-icon-wrap">
            <button
              type="button"
              className="profile-btn"
              aria-haspopup="true"
              aria-expanded={openDropdown === "profile"}
              aria-label="Profile menu"
              onClick={(e) => toggleDropdown("profile", e)}
            >
              <span className="profile-avatar" aria-hidden="true">{initials}</span>
            </button>

            <div className="dropdown-panel profile-menu" role="dialog" aria-label="Profile menu" hidden={openDropdown !== "profile"} onClick={stopPropagation}>
              <div className="profile-menu-header">
                <span className="profile-avatar large" aria-hidden="true">{initials}</span>
                <div>
                  <p className="profile-menu-name">{profile.fullName}</p>
                  <p className="profile-menu-email">{profile.email}</p>
                </div>
              </div>
              <ul className="profile-menu-list">
                <li>
                  <Link to="/profile" className="profile-menu-item" onClick={() => setOpenDropdown(null)}>
                    <span className="material-symbols-outlined" aria-hidden="true">person</span>
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link to="/my-tickets" className="profile-menu-item" onClick={() => setOpenDropdown(null)}>
                    <span className="material-symbols-outlined" aria-hidden="true">confirmation_number</span>
                    My Tickets
                  </Link>
                </li>
                <li>
                  <button type="button" className="profile-menu-item" onClick={() => { setOpenDropdown(null); openModal("settings"); }}>
                    <span className="material-symbols-outlined" aria-hidden="true">settings</span>
                    Settings
                  </button>
                </li>
                <li className="profile-menu-item dark-mode-row">
                  <span className="dark-mode-label">
                    <span className="material-symbols-outlined" aria-hidden="true">dark_mode</span>
                    Dark Mode
                  </span>
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
                </li>
                <li>
                  <button
                    type="button"
                    className="profile-menu-item danger"
                    onClick={() => { setOpenDropdown(null); openModal("signout"); }}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">logout</span>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-expanded={mobileNavOpen}
            aria-controls="mobileNav"
            aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
            onClick={(e) => { e.stopPropagation(); setMobileNavOpen((v) => !v); }}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{mobileNavOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <nav className="mobile-nav" id="mobileNav" aria-label="Mobile" hidden={!mobileNavOpen}>
        <a href="/#hero" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>Dashboard</a>
        <Link to="/my-tickets" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>My Tickets</Link>
        <a href="/#knowledgeBase" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>Knowledge Base</a>
        <button type="button" className="mobile-nav-link mobile-nav-link-btn" onClick={openContact}>Contact</button>
      </nav>
    </header>
  );
}
