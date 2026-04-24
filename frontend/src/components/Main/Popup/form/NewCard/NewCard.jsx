import { useContext, useState } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

function NewCard() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  function handleSubmit(e) {
    e.preventDefault();
    handleAddPlaceSubmit({ title: name, link });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="popup__form"
      name="card-form"
      id="new-card-form"
      noValidate
    >
      <label className="popup__field">
        <input
          type="text"
          name="card-name"
          placeholder="Título"
          className="popup__input popup__input_type-name"
          id="card-name"
          required
          minLength="2"
          maxLength="30"
          value={name}
          onChange={handleNameChange}
        />
        <span id="title-error" className=""></span>
      </label>

      <label className="popup__field">
        <input
          type="url"
          name="card-link"
          placeholder="Enlace a la imagen"
          className="popup__input popup__input_type-link"
          id="card-link"
          required
          value={link}
          onChange={handleLinkChange}
        />
        <span id="link-error" className=""></span>
      </label>
      <button className="button popup__button" type="submit">
        Crear
      </button>
    </form>
  );
}
export default NewCard;
