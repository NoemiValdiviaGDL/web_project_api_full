import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return validator.isEmail(email);
      },
      message: "El formato del correo no es válido",
    },
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Lady Gaga",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Actriz y Cantante",
  },

  avatar: {
    type: String,
    default:
      "https://ichef.bbci.co.uk/news/480/cpsprodpb/197d/live/62057290-fa95-11ef-a24f-f97f794e18ea.jpg.webp",
    validate: {
      validator: function (v) {
        return /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[^\s]*)?$/.test(
          v,
        );
      },
      message: "El avatar debe der una URL válida",
    },
  },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Correo o contraseña incorrectos"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Correo o contraseña incorrectos"));
        }
        return user;
      });
    });
};
const User = mongoose.model("user", userSchema);
export default User;
