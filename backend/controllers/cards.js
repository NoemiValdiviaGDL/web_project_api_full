import Card from "../models/cards.js";

// GET /cards — obtener todas las tarjetas
export const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.json(cards))
    .catch(next);
};

// POST /cards — crear una nueva tarjeta
export const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id, // ID temporal
  })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = 400; // Asignamos código para datos inválidos
      }
      next(err);
    });
};

// DELETE /cards/:cardId — eliminar tarjeta por ID
export const deleteCardById = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (card.owner.toString() !== userId.toString()) {
        const error = new Error("No tienes permiso para borrar esta tarjeta");
        error.statusCode = 403;
        throw error;
      }
      return Card.findByIdAndDelete(card._id);
    })
    .then(() => res.json({ message: "Tarjeta eliminada con éxito" }))
    .catch(next);
};

// PUT /cards/:cardId/likes — dar like
export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { returnDocument: "after" },
  )
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === "CastError") err.statusCode = 400;
      next(err);
    });
};

// DELETE /cards/:cardId/likes — quitar like
export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { returnDocument: "after" },
  )
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.json(card))
    .catch((err) => {
      if (err.name === "CastError") err.statusCode = 400;
      next(err);
    });
};
