import { useRef, useContext } from "react";
import CurrentUserContext from "../../../../../contexts/CurrentUserContext";

function EditAvatar() {
  const avatarRef = useRef();
  const { handleUpdateAvatar } = useContext(CurrentUserContext);

  function handleSubmit(e) {
    e.preventDefault();

    handleUpdateAvatar({
      link: avatarRef.current.value,
    });
  }

  return (
    <form
      className="popup__form"
      name="avatar-form"
      id="avatar-form"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="popup__field">
        <input
          className="popup__input popup__input_type-img"
          type="url"
          name="avatar-link"
          placeholder="link de la imagen"
          id="avatar-link"
          required
          ref={avatarRef}
        />
        <span id="link-error" className=""></span>
      </label>
      <button className="button popup__button" type="submit">
        Guardar
      </button>
    </form>
  );
}
export default EditAvatar;
