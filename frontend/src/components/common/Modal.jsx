// src/components/common/Modal.jsx
import { useEffect } from "react";
import styles from "./Modal.module.css";

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  className = "",
  isCanvasModal = false,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return styles.small;
      case "medium":
        return styles.medium;
      case "large":
        return styles.large;
      case "extra-large":
        return styles.extraLarge;
      default:
        return styles.medium;
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${
        isCanvasModal ? styles.canvasModal : ""
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`${styles.modalContainer} ${getSizeClass()} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="关闭"
            >
              ×
            </button>
          </div>
        )}

        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
