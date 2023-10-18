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

export const updatelist = async (req, res) => {
  try {
    const listId = req.params.id;
    const updateList = await listModel.updateOne(
      {
        _id: listId,
      },
      {
        title: req.body.title,
        text: req.body.text,
      }
    );
    if (!listId) {
      return res.status(404).json({
        message: "Лист не найден ",
      });
    }
    res.json({
      message: listId + "Статья обновлена",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Не удалось обновить лист",
    });
  }
};

export const deleteList = async (req, res) => {
  try {
    const listId = req.params.id;
    const deleteList = await listModel.deleteOne({
      _id: listId,
    });
    if (!listId) {
      return res.status(404).json({
        message: "Не удалось удалить лист ",
      });
    }
    res.json({
      message: listId + " Удален",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Не удалось удалить лист ",
    });
  }
};

export const getAllUsersLists = async (req, res) => {
  try {
    const userId = req.userId;
    const getLists = await listModel.find({
      userId: userId,
    });
    if (!userId) {
      return res.status(404).json({
        message: "Аккаунт не найден",
      });
    }
    res.json(getLists);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Не удалось получить лист",
    });
  }
};
