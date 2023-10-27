import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import { tokenService } from "../utils/index.js";
import UserDto from "../Dtos/userDto.js";
import tokenModel from "../models/tokenModel.js";

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

    const { hash, ...userData } = user._doc;
    res.cookie("refreshToken", token.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
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

    const { passwordHash, ...userData } = user._doc;
    res.cookie("refreshToken", token.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
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

export const logout = async (req, res) => {
  try {
    const { refreshToken } = res.cookie;
    const token = await tokenService.removeToken(refreshToken);
    res.clearCookie("refreshToken");
    return res.json(token);
  } catch (err) {
    console.log(err);
    res.json({
      message: err,
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookie;
    if (!refreshToken) {
      return res.json({
        message: "Токена нет!",
      });
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenModel.findOne(refreshToken);
    if (!userData || !tokenFromDb) {
      return res.json({
        message: "Токена нет!",
      });
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens(...userDto);

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  } catch (err) {
    console.log(err);
  }
};
