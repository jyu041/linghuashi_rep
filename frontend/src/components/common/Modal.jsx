// src/components/common/Modal.jsx
import "./Modal.css";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  className = "",
  isCanvasModal = false, // New prop for canvas overlay modals
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "modal-content-small";
      case "large":
        return "modal-content-large";
      case "extra-large":
        return "modal-content-extra-large";
      default:
        return "modal-content-medium";
    }
  };

  const overlayClassName = `modal-overlay ${
    isCanvasModal ? "canvas-modal" : ""
  }`;

  return (
    <div className={overlayClassName} onClick={handleOverlayClick}>
      <div
        className={`modal-content ${getSizeClass()} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-header">
            <h3 className="modal-title">{title}</h3>
            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
