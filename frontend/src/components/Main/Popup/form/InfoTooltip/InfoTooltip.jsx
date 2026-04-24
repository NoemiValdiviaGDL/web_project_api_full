import errorIcon from "../../../../../../images/error.png";
import successIcon from "../../../../../../images/succsses.png";

function InfoTooltip({ isSuccess, message }) {
  return (
    <div className="popup__form">
      <img
        src={isSuccess ? successIcon : errorIcon}
        alt={isSuccess ? "Éxito" : "Error"}
        className="popup__tooltip-image"
      />
      <p className="popup__tooltip-message">
        {isSuccess
          ? message || "¡Correcto! Todo ha salido bien."
          : message || "Uy, algo salió mal. Inténtalo de nuevo."}
      </p>
    </div>
  );
}

export default InfoTooltip;
