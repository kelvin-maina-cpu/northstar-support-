export default function Modal({ id, open, onClose, labelledBy, small, alertdialog, children }) {
  if (!open) return null;

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" id={id} onClick={handleOverlayClick}>
      <div
        className={`modal${small ? " modal-small" : ""}`}
        role={alertdialog ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>
  );
}
