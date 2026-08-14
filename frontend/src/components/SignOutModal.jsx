import Modal from "./Modal";
import { useModal } from "../context/ModalContext";
import { useToast } from "../context/ToastContext";

export default function SignOutModal() {
  const { activeModal, closeModal } = useModal();
  const { showToast } = useToast();
  const open = activeModal === "signout";

  function handleConfirm() {
    // Future: Replace with a real sign-out call once auth exists.
    closeModal();
    showToast("You've been signed out of this demo session.");
  }

  return (
    <Modal id="signOutModal" open={open} onClose={closeModal} labelledBy="signOutModalTitle" small alertdialog>
      <div className="modal-header">
        <h2 id="signOutModalTitle">Sign Out</h2>
      </div>
      <div className="modal-body">
        <p>This is an MVP demo without live authentication. Signing out will simply reset your demo session.</p>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>Sign Out</button>
      </div>
    </Modal>
  );
}
