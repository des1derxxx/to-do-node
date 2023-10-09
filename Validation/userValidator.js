import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен содердать больше 4 символов").isLength({
    min: 4,
  }),
  body("fullName", "Имя должно содержать больше 5 символов").isLength({
    min: 5,
  }),
];
