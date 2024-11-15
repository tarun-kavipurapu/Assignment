import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import crypto from "crypto";
import createError from "http-errors";

import jwt from "jsonwebtoken";
import { config } from "../config";

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    return hashedPass;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new createError.InternalServerError("Failed to Hash Pasword");
  }
};

export const comparePassword = async (
  originalPassword: string,
  hashedPassword: string
) => {
  try {
    const isSame = await bcrypt.compare(originalPassword, hashedPassword);

    return isSame;
  } catch (error) {
    console.error("Error Comparing Password");
    throw new createError.InternalServerError("Failed to compare Pasword");
  }
};

export const generateAccessToken = (user: User) => {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      config.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return token;
  } catch (error) {
    throw new createError.InternalServerError(
      "Failed to Generate Access Token"
    );
  }
};

// export const generateTemporaryToken = function () {
//   // This token should be client facing
//   // for example: for email verification unHashedToken should go into the user's mail
//   const unHashedToken = crypto.randomBytes(20).toString("hex");

//   // This should stay in the DB to compare at the time of verification
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(unHashedToken)
//     .digest("hex");
//   // This is the expiry time for the token (20 minutes)
//   const tokenExpiry = Date.now() + USER_TEMPORARY_TOKEN_EXPIRY;

//   return { unHashedToken, hashedToken, tokenExpiry };
// };
