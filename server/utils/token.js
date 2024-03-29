import tokenModel from "../models/tokenModel.js";
import jwt from "jsonwebtoken";

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, process.env.token_word, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(payload, process.env.token_word, {
    expiresIn: "30d",
  });
  return {
    accessToken,
    refreshToken,
  };
};
export const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.token_word);
    return userData;
  } catch (err) {
    return null;
  }
};
export const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.token_word);
    return userData;
  } catch (err) {
    return null;
  }
};
export const saveToken = async (userId, refreshToken, accessToken) => {
  const tokenData = await tokenModel.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }
  const token = await tokenModel.create({
    user: userId,
    refreshToken,
    accessToken,
  });
  return token;
};

export const removeToken = async (refreshToken) => {
  const tokenData = await tokenModel.deleteOne({ refreshToken });
  return tokenData;
};

export const findToken = async (refreshToken) => {
  const tokenData = await tokenModel.findOne({ refreshToken });
  return tokenData;
};
