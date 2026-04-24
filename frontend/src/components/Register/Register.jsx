import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../images/logo.png";
import eyeOpen from "../../../images/eye_open.png";
import eyeclose from "../../../images/eye_close.png";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordDirty, setIsPasswordDirty] = useState(false);
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  // Expresión regular para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 8;

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    if (!isPasswordDirty) setIsPasswordDirty(true);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Bloqueo de seguridad: si no es válido, no enviamos
    if (!isEmailValid || !isPasswordValid) return;

    onRegister(email, password)
      .then(() => {
        navigate("/signin", { replace: true });
      })
      .catch((err) => {
        console.log("Error de registro", err);
      });
  }

  return (
    <div className="register__page">
      <section className="register__header">
        <img
          src={logo}
          alt="around the U.S"
          className="register__header-logo"
        />
        <Link to="/signin" className="register__signin-link">
          Iniciar sesión
        </Link>
      </section>

      <form className="register__form" onSubmit={handleSubmit} noValidate>
        <h2 className="register__form-title">Regístrate</h2>

        {/* --- CAMPO EMAIL --- */}
        <div className="register__field">
          <input
            className={`register__input ${isEmailDirty && !isEmailValid ? "register__input_type_error" : ""}`}
            id="email"
            required
            name="email"
            placeholder="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setIsEmailDirty(true)}
          />
          {isEmailDirty && !isEmailValid && (
            <span className="register__input-error">
              Formato de correo inválido
            </span>
          )}
        </div>

        {/* --- CAMPO CONTRASEÑA CON OJO --- */}
        <div className="register__field register__field_type_password">
          <input
            className={`register__input ${isPasswordDirty && !isPasswordValid ? "register__input_type_error" : ""}`}
            id="password"
            required
            name="password"
            placeholder="Contraseña"
            // Cambia dinámicamente el tipo
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={handleChangePassword}
          />

          {/* Botón del Ojo */}
          <button
            type="button"
            className="register__eye-button"
            onClick={togglePasswordVisibility}
          >
            <img
              src={isPasswordVisible ? eyeOpen : eyeclose}
              alt="Ver contraseña"
              className="register__eye-icon"
            />
          </button>

          {isPasswordDirty && (
            <span
              className={`register__input-error ${isPasswordValid ? "register__input-error_valid" : ""}`}
            >
              {isPasswordValid
                ? "✓ Contraseña válida"
                : `Mínimo 8 caracteres (llevas ${password.length})`}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={`register__button ${!isEmailValid || !isPasswordValid ? "register__button_disabled" : ""}`}
          disabled={!isEmailValid || !isPasswordValid}
        >
          Regístrate
        </button>
      </form>

      <div className="signup__link-container">
        <p className="signup__text">
          ¿Ya eres miembro?{" "}
          <Link to="/signin" className="signup__link">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
