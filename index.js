import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import listSchema from "./models/list.js";
import list from "./models/list.js";
import cors from "cors";
import { listController, UserController } from "./Controllers/index.js";
import {
  loginValidation,
  registerValidation,
} from "./Validation/userValidator.js";
import { handleValidationError, checkAuth } from "./utils/index.js";
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Db ok");
  })
  .catch((err) => {
    console.log(err);
  });

app.post(
  "/auth/register",
  registerValidation,
  handleValidationError.handleError,
  UserController.register
);

app.post("/auth/login", loginValidation, UserController.login);
app.post("/posts", checkAuth.checkAuth, listController.create);
app.get("/posts/:id", checkAuth.checkAuth, listController.getUserLists);

app.listen(3333, () => {
  console.log("Ok");
});
