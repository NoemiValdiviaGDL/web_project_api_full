// middleware/error-handler.js
export const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "Ha ocurrido un error en el servidor" : message,
  });
};
