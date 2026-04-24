import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).send({ message: "Se requiere autorización" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    const secret = process.env.JWT_SECRET || "mi_super_secreto_ultra_largo_123";
    payload = jwt.verify(token, secret);

    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).send({ message: "Token inválido o expirado" });
  }
};
