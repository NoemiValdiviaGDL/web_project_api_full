console.log("ESTE ES MI BACKEND REAL");
import dotenv from "dotenv";
import express from "express";
import { login, createUser } from "./controllers/users.js";
import usersRouter from "./routes/users.js";
import cardsRouter from "./routes/cards.js";
import mongoose from "mongoose";
import { errors } from "celebrate";
import { errorHandler } from "./middlewares/error-handler.js";
import {
  validateAuthentication,
  validateUserBody,
} from "./middlewares/validation.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";
import { auth } from "./middlewares/auth.js";
dotenv.config();
import cors from "cors";

const { PORT = 3001 } = process.env;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
  next();
});

app.use(requestLogger);

app.post("/signin", validateAuthentication, login);
app.post("/signup", validateUserBody, createUser);
app.use("/users", auth, usersRouter);
app.use("/cards", auth, cardsRouter);

app.use((req, res, next) => {
  const error = new Error("Recurso no encontrado");
  error.statusCode = 404;
  next(error);
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose
  .connect("mongodb://localhost:27017/mydb")
  .then(() => {
    console.log("Conectado a MongoDB");

    app.listen(PORT, () => {
      console.log(`Servidor encendido en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error conectando a Mongo:", err);
  });
