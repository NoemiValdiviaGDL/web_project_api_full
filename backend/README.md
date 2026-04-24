# Around The U.S. API - Back-end (Node.js + Express)

Este es el servidor que alimenta la red social. Proporciona una API REST completa para gestionar usuarios, tarjetas de imágenes y la autenticación necesaria para proteger la información.

## 🛠️ Tecnologías y Herramientas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework para la gestión de rutas y middleware.
- **MongoDB & Mongoose**: Base de datos NoSQL y modelado de datos.
- **JWT (JSON Web Tokens)**: Para la autorización segura de usuarios.
- **Express-Validator**: Implementación de expresiones regulares y validación de esquemas.

## 🛣️ Rutas de la API

- **Usuarios**:
  - `GET /users` - Obtiene la lista de usuarios.
  - `GET /users/:id` - Obtiene la información de un usuario específico.
  - `PATCH /users/me` - Actualiza el perfil del usuario actual.
- **Tarjetas**:
  - `GET /cards` - Lista todas las fotografías compartidas.
  - `POST /cards` - Crea una nueva publicación.
  - `DELETE /cards/:id` - Elimina una fotografía (solo del propietario).
- **Autenticación**:
  - `POST /signin` - Inicio de sesión.
  - `POST /signup` - Registro de nuevos usuarios.

## 🛡️ Seguridad y Validaciones

Se han implementado manejadores de errores centralizados y validación estricta de URLs mediante expresiones regulares para asegurar que los enlaces a las fotografías sean válidos.
