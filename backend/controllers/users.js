import "dotenv/config";
import bcrypt from "bcryptjs";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

// GET /users — obtener todos los usuarios
export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.json(users))
    .catch(next);
};

// GET /users/:userId — obtener usuario por ID
export const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "CastError") err.statusCode = 400;
      next(err);
    });
};
//Obtener usuario actual
export const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch(next);
};

//Login
export async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const secret = process.env.JWT_SECRET || "mi_super_secreto_ultra_largo_123";

    const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "7d" });

    return res.status(200).send({ token });
  } catch (err) {
    if (
      err.name === "AuthError" ||
      err.message === "Correo o contraseña incorrectos"
    ) {
      err.statusCode = 401;
      err.message = "Correo o contraseña incorrectos";
    }

    next(err);
  }
}

// POST /users — crear un nuevo usuario
export async function createUser(req, res, next) {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      ...(name && { name }),
      ...(about && { about }),
      ...(avatar && { avatar }),
    });
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.name === "ValidationError") err.statusCode = 400;
    if (err.code === 11000) {
      err.statusCode = 409;
      err.message = "El usuario ya existe";
    }
    next(err);
  }
}

// PATCH /users/me — actualizar perfil
export const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })

    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") err.statusCode = 400;
      next(err);
    });
};

// PATCH /users/me/avatar — actualizar avatar
export const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") err.statusCode = 400;
      next(err);
    });
};
