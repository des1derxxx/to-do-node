import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import listSchema from "./models/list.js";
import list from "./models/list.js";
import cors from "cors";
import { listController } from "./Controllers/index.js";

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

app.post("/", listController.create);
app.get("/", listController.getAllLists);

app.listen(4444, console.log("Ok"));
