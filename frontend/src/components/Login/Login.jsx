import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../../images/logo.png";
import eyeOpen from "../../../images/eye_open.png";
import eyeclose from "../../../images/eye_close.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  //validación
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 8;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid) return;

    onLogin(email, password)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log("Correo o contraseña incorrectos", err);
      });
  }

  return (
    <div className="login__page">
      <section className="login__header">
        <img src={logo} alt="around the U.S" className="login__header-logo" />
        <Link to="/signup" className="login__signup-link">
          Regístrate
        </Link>
      </section>

      <form
        className="login__form"
        name="login-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <h2 className="login__form-title">Iniciar sesión</h2>

        <div className="login__field">
          <input
            className={`login__input ${isEmailDirty && !isEmailValid ? "login__input_type_error" : ""}`}
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
            <span className="login__input-error">
              Formato de correo inválido
            </span>
          )}
        </div>

        <div className="login__field login__field_type_password">
          <input
            className={`login__input ${password.length > 0 && !isPasswordValid ? "login__input_type_error" : ""}`}
            id="password"
            required
            name="password"
            placeholder="Contraseña"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login__eye-button"
            onClick={togglePasswordVisibility}
          >
            <img
              src={isPasswordVisible ? eyeOpen : eyeclose}
              alt="Ver contraseña"
              className="login__eye-icon"
            />
          </button>
          {password.length > 0 && !isPasswordValid && (
            <span className="login__input-error">Mínimo 8 caracteres</span>
          )}
        </div>

        <button
          type="submit"
          className={`login__button ${!isEmailValid || !isPasswordValid ? "login__button_disabled" : ""}`}
          disabled={!isEmailValid || !isPasswordValid}
        >
          Iniciar sesión
        </button>
      </form>

      <div className="signin__link-container">
        <p className="signin__text">
          ¿Aún no eres miembro?{" "}
          <Link to="/signup" className="signin__link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
