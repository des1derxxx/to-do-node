import tokenModel from "../models/tokenModel.js";
import jwt from "jsonwebtoken";

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.token_word, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.token_word, {
      expiresIn: "15m",
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
