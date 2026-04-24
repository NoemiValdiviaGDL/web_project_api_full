import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

function EditProfile() {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setDescription(currentUser.about || "");
    }
  }, [currentUser]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    handleUpdateUser({ name, about: description });
  };
  return (
    <form
      className="popup__form"
      name="profile-form"
      id="profile-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type-name"
          id="owner-name"
          minLength="2"
          maxLength="40"
          name="userName"
          placeholder="Nombre"
          required
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span id="owner-name-error" className="popup__error"></span>
      </label>
      <label className="popup__field">
        <input
          className="popup__input popup__input_type-about"
          id="owner-description"
          minLength="2"
          maxLength="400"
          name="userDescription"
          placeholder="Acerca de mi"
          required
          type="text"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span id="owner-description-error" className="popup__error"></span>
      </label>
      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
}
export default EditProfile;
