import List from "../models/list.js";
import listModel from "../models/list.js";

export const create = async (req, res) => {
  try {
    const doc = new listModel({
      title: req.body.title,
      text: req.body.text,
      userId: req.userId,
    });

    const list = await doc.save();

    res.json(list);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Не удалось создать",
    });
  }
};

export const getAllLists = async (req, res) => {
  try {
    const doc = await listModel.find();

    if (!doc) {
      return res.json({
        message: "Нет записей",
      });
    }
    res.json(doc);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Не удалось получить листы",
    });
  }
};

export const getUserLists = async (req, res) => {
  try {
    const userId = req.params.id;
    const getUserLists = await listModel.find({ userId: userId });

    res.json(getUserLists);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Не удалось получить лист",
    });
  }
};
