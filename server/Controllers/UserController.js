import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import { tokenService } from "../utils/index.js";

import UserDto from "../Dtos/userDto.js";

export const register = async (req, res) => {
  try {
    //const password = req.body.password.toString();
    const { email, fullName, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, Number(salt));

    const doc = new UserModel({
      email,
      fullName,
      passwordHash,
    });
    const user = await doc.save();
    const userDto = new UserDto(user);
    const token = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(
      userDto.id,
      token.refreshToken,
      token.accessToken
    );

    // const token = await jwt.sign(
    //   {
    //     _id: user._id,
    //   },
    //   process.env.token_word,
    //   {
    //     expiresIn: "30d",
    //   }
    // );

    const { hash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Error" + err,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(401).json({
        message: "Пользователь не найден",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(401).json({
        message: "Неверный пароль или логин",
      });
    }

    const userDto = new UserDto(user);
    const token = tokenService.generateTokens(userDto);
    await tokenService.saveToken(
      userDto.id,
      token.refreshToken,
      token.accessToken
    );

    // const token = await jwt.sign(
    //   {
    //     _id: user._id,
    //   },
    //   "secret123",
    //   {
    //     expiresIn: "30d",
    //   }
    // );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Ошибка" + err,
    });
  }
};
