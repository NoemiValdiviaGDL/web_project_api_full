import { useContext } from "react";
import Popup from "./Popup/Popup.jsx";
import NewCard from "./Popup/form/NewCard/NewCard.jsx";
import EditProfile from "./Popup/form/EditProfile/EditProfile.jsx";
import EditAvatar from "./Popup/form/EditAvatar/EditAvatar.jsx";
import editAvatarBtn from "../../../images/edit_avatar.png";
import editProfileBtn from "../../../images/edit_button.png";
import addPictureBtn from "../../../images/add_button.png";
import Card from "../Card/Card.jsx";
import ImagePopup from "./Popup/form/ImagePopup/ImagePopup.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

function Main({
  cards,
  popup,
  onOpenPopup,
  onClosePopup,
  onCardClick,
  onCardLike,
  onCardDelete,
  onAddPlaceSubmit,
  selectedCard,
  onCloseImage,
}) {
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup = {
    title: "Nuevo lugar",
    children: <NewCard onAddPlaceSubmit={onAddPlaceSubmit} />,
  };
  const editProfilePopup = {
    title: "Editar perfil",
    children: <EditProfile onAddPlaceSubmit={onAddPlaceSubmit} />,
  };
  const editAvatarPopup = {
    title: "Cambiar foto de perfil",
    children: <EditAvatar onAddPlaceSubmit={onAddPlaceSubmit} />,
  };

  return (
    <main>
      <section className="profile">
        <div className="profile__avatar-container">
          <img
            src={currentUser?.avatar}
            alt="profile person"
            className="profile__avatar"
          />

          <button
            className="profile__button-edit-avatar"
            aria-label="Open modal"
            type="button"
            onClick={() => onOpenPopup(editAvatarPopup)}
          >
            <img
              className="profile__button-edit-avatar-icon"
              src={editAvatarBtn}
              alt="edit profile"
            />
          </button>
        </div>

        <div className="profile__info">
          <h1 className="profile__name">{currentUser?.name}</h1>

          <button
            className="profile__button-edit"
            aria-label="Open modal"
            type="button"
            onClick={() => onOpenPopup(editProfilePopup)}
          >
            <img
              className="profile__button-edit-icon"
              src={editProfileBtn}
              alt="edit profile"
            />
          </button>
          <h2 className="profile__about">{currentUser?.about}</h2>
        </div>

        <button
          aria-label="Open modal"
          type="button"
          className="profile__button-add"
          onClick={() => onOpenPopup(newCardPopup)}
        >
          <img
            className="profile__button-add-icon"
            src={addPictureBtn}
            alt="add card"
          />
        </button>
      </section>
      {popup && (
        <Popup title={popup.title} onClose={onClosePopup} isOpen>
          {popup.children}
        </Popup>
      )}
      <ul className="cards__list">
        {currentUser &&
          cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              isLiked={card.isLiked}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
              onAddPlaceSubmit={onAddPlaceSubmit}
            />
          ))}
      </ul>

      <ImagePopup
        isOpen={!!selectedCard}
        card={selectedCard}
        onClose={onCloseImage}
      />
    </main>
  );
}
export default Main;
