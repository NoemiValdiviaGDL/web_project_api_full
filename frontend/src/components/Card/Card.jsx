import likeIcon from "../../../images/me_gusta.svg";
import activeLikeIcon from "../../../images/me_gusta_active.svg";
import deleteButton from "../../../images/delete_icon.svg";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const { currentUser } = useContext(CurrentUserContext);
  const { name, link, likes, owner } = card;
  const isOwn = owner === currentUser._id;
  const isLiked = likes.some((id) => id === currentUser._id);

  function handleLikeClick() {
    onCardLike(card);
  }
  function handleDeleteClick() {
    onCardDelete(card);
  }
  const cardLikeButtonClassName = `card__like-button ${isLiked ? "card__like-button_active" : ""}`;

  return (
    <li className="card">
      <img
        className="card__picture"
        src={link}
        alt={name}
        onClick={() => onCardClick(card)}
      />

      <div className="card__description">
        <h2 className="card__title">{name}</h2>

        <button
          className={cardLikeButtonClassName}
          aria-label="Like card"
          type="button"
          onClick={handleLikeClick}
        >
          <span className="card__like-count">{card.likes.length}</span>
          <img
            className="card__like-button-icon"
            src={isLiked ? activeLikeIcon : likeIcon}
            alt="like"
          />
        </button>
      </div>
      {isOwn && (
        <button
          className="card__delete-button"
          onClick={() => onCardDelete(card)}
          type="button"
        >
          <img src={deleteButton} alt="Eliminar" />
        </button>
      )}
    </li>
  );
}
export default Card;
