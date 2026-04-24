import { useEffect } from "react";
function Popup({ onClose, title, children, isOpen }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }
  return (
    <div
      className={`popup ${isOpen ? "popup_opened" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div className="popup__container">
        <button
          aria-label="Close modal"
          type="button"
          className="popup__button-close"
          onClick={onClose}
        >
          <img
            className="popup__button-close-icon"
            src="images/Close Icon.png"
          />
        </button>
        <h3 className="popup__title">{title}</h3>
        {children}
      </div>
    </div>
  );
}
export default Popup;
