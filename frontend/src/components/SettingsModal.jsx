import Modal from "./Modal";
import { useModal } from "../context/ModalContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsModal() {
  const { activeModal, closeModal } = useModal();
  const { theme, toggleTheme } = useTheme();
  const open = activeModal === "settings";
  const isDark = theme === "dark";

  return (
    <Modal id="settingsModal" open={open} onClose={closeModal} labelledBy="settingsModalTitle">
      <div className="modal-header">
        <h2 id="settingsModalTitle">Settings</h2>
        <button type="button" className="modal-close" aria-label="Close settings" onClick={closeModal}>
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>
      </div>

      <div className="modal-body">
        <div className="settings-row">
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
        </div>
        <p className="settings-note">Additional account settings will be available once the backend is connected.</p>
      </div>
    </Modal>
  );
}
