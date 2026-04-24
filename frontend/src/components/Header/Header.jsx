// src/components/Header/Header.jsx
import { useState } from "react";
import logo from "../../../images/logo.png";
import menuIcon from "../../../images/menu.png";
import closeIcon from "../../../images/close_icon_image.png";

function Header({ email, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <header className="header">
      <div
        className={`header__user-expanded ${isMenuOpen ? "header__user-expanded_opened" : ""}`}
      >
        <p className="header__email">{email}</p>
        <button
          className="header__logout header__logout_type_expanded"
          type="button"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </div>

      <div className="header__bar">
        <img src={logo} alt="around the U.S" className="header__logo" />

        <div className="header__user-desktop">
          <p className="header__email">{email}</p>
          <button className="header__logout" type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>

        <button
          className="header__menu-button"
          type="button"
          onClick={toggleMenu}
        >
          <img
            src={isMenuOpen ? closeIcon : menuIcon}
            alt={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            className="header__menu-icon"
          />
        </button>
      </div>
    </header>
  );
}
export default Header;
