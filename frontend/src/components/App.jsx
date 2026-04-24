import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";
import Main from "./Main/Main.jsx";
import Login from "./Login/Login.jsx";
import Register from "./Register/Register.jsx";
import Popup from "./Main/Popup/Popup.jsx";
import InfoTooltip from "./Main/Popup/form/InfoTooltip/InfoTooltip.jsx";
import { api } from "../utils/api.js";
import { authorize, register, checkToken } from "../utils/Auth.js";
import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [popup, setPopup] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = useState("");

  const successTooltipPopup = {
    title: "",
    children: <InfoTooltip isSuccess={true} />,
  };

  const errorTooltipPopup = {
    title: "",
    children: <InfoTooltip isSuccess={false} />,
  };

  const getFriendlyMessage = (err) => {
    if (typeof err !== "string") return "Algo salió mal. Inténtalo de nuevo.";
    if (
      err.toLowerCase().includes("url") ||
      err.toLowerCase().includes("format")
    ) {
      return "La dirección (URL) ingresada no es válida. Por favor, verifica el formato.";
    }
    if (err.includes("401"))
      return "Sesión expirada o credenciales incorrectas.";
    if (err.includes("409")) return "Este correo ya está registrado.";
    if (err.includes("400")) return "Por favor, revisa los datos ingresados.";
    if (err.includes("Failed to fetch"))
      return "No hay conexión con el servidor.";
    return err;
  };

  function handleGlobalError(err, customMessage) {
    console.error("Manejador Global:", err);
    handleOpenPopup({
      title: "",
      children: (
        <InfoTooltip
          isSuccess={false}
          message={customMessage || getFriendlyMessage(err)}
        />
      ),
    });
    if (typeof err === "string" && err.includes("401")) {
      handleLogout();
    }
  }

  function handleLogin(email, password) {
    return authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("jwt", res.token);
          return checkToken();
        }
        throw new Error("No se recibió el token");
      })
      .then((res) => {
        const email = res.data ? res.data.email : res.email;

        setLoggedIn(true);
        setUserEmail(email);
      })
      .catch((err) => {
        handleOpenPopup({
          title: "",
          children: (
            <InfoTooltip isSuccess={false} message={getFriendlyMessage(err)} />
          ),
        });
      });
  }

  function handleLogout() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setUserEmail("");
  }

  function handleRegister(email, password) {
    return register(email, password)
      .then(() => {
        handleOpenPopup({
          title: "",
          children: (
            <InfoTooltip
              isSuccess={true}
              message="¡Registro completado con éxito!"
            />
          ),
        });
        setTimeout(() => handleClosePopup(), 4000);
      })
      .catch((err) => {
        handleOpenPopup({
          title: "",
          children: (
            <InfoTooltip isSuccess={false} message={getFriendlyMessage(err)} />
          ),
        });
      });
  }

  //token
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      checkToken(token)
        .then((res) => {
          if (res) {
            const email = res.data ? res.data.email : res.email;

            setLoggedIn(true);
            setUserEmail(email);
          }
        })
        .catch((err) => {
          console.error("Token inválido:", err);
          localStorage.removeItem("jwt");
          setLoggedIn(false);
        });
    }
  }, []);

  //datos del usuario
  useEffect(() => {
    if (!loggedIn) return;

    Promise.all([api.getUser(), api.getInitialCards()])
      .then(([userData, cardsData]) => {
        setCurrentUser(userData);
        setCards(cardsData);
      })
      .catch(console.log);
  }, [loggedIn]);

  //actualizar info del usuario
  function handleUpdateUser(data) {
    api
      .setUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch(handleGlobalError);
  }

  //actiualizar avatar
  function handleUpdateAvatar(data) {
    api
      .setUserAvatar(data)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        handleClosePopup();
      })
      .catch((err) => {
        handleGlobalError(
          err,
          "La URL del avatar no es válida o no se pudo cargar.",
        );
      });
  }

  //actualizar likes
  function handleCardLike(card) {
    const isLiked = card.likes.some((id) => id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c)),
        );
      })
      .catch(handleGlobalError);
  }
  //eliminar tarjetas
  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(handleGlobalError);
  }
  //agregar tarjetas
  function handleAddPlaceSubmit(data) {
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))/i;

    if (!urlPattern.test(data.link)) {
      handleOpenPopup({
        title: "",
        children: (
          <InfoTooltip
            isSuccess={false}
            message="El enlace debe ser una URL de imagen válida (http/https)."
          />
        ),
      });
      return; // Detenemos la ejecución aquí
    }

    api
      .addCard(data)
      .then((newCard) => {
        setCards((prevCards) => [newCard, ...prevCards]);
        handleClosePopup();
      })
      .catch(handleGlobalError);
  }

  //abrir popups
  function handleOpenPopup(popupData) {
    setPopup(popupData);
  }

  function handleClosePopup() {
    setPopup(null);
  }
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
      }}
    >
      <Routes>
        <Route
          path="/signin"
          element={
            loggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            loggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Register onRegister={handleRegister} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn} onLogout={handleLogout}>
              <>
                <Header email={userEmail} onLogout={handleLogout} />
                <Main
                  cards={cards}
                  popup={popup}
                  onOpenPopup={handleOpenPopup}
                  onClosePopup={() => setPopup(null)}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  onAddPlaceSubmit={handleAddPlaceSubmit}
                  onCardClick={setSelectedCard}
                  selectedCard={selectedCard}
                  onCloseImage={() => setSelectedCard(null)}
                />
                <Footer />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/" : "/signin"} replace />}
        />
      </Routes>
      {popup && (
        <Popup title={popup.title} onClose={handleClosePopup} isOpen>
          {popup.children}
        </Popup>
      )}
    </CurrentUserContext.Provider>
  );
}

export default App;
