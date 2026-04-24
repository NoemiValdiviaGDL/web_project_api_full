import { useEffect } from "react";

function ImagePopup({ isOpen, card, onClose }) {
  if (!card) return null;

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
      className={`popup popup--image ${isOpen ? "popup_opened" : ""}`}
      onMouseDown={handleOverlayClick}
    >
      <div className="popup__container-picture">
        <button className="popup__button-close" onClick={onClose}>
          <img src="images/Close Icon.png" alt="close button" />
        </button>
        <img src={card.link} alt="paisaje" className="popup__picture-full" />
        <p className="popup__picture-caption">{card.name}</p>
      </div>
    </div>
  );
}
export default ImagePopup;
