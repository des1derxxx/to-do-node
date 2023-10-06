import mongoose, { Schema } from "mongoose";

const listSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
});

export default mongoose.model("list", listSchema);
