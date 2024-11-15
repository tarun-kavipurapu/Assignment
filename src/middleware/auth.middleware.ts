import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import prismaClient from "../config/prismaClient";
import { UserInterface } from "../types";
import createError from "http-errors";

declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}

//supports both cookkie and and header
// Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
// Then they will get a new access token which will allow them to refresh the access token without logging out the user
export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new createError.Unauthorized("Unauthorized request");
  }

  try {
    const decodedtoken = jwt.verify(token, config.JWT_SECRET);
    const user = await prismaClient.user.findUnique({
      where: {
        id: (decodedtoken as JwtPayload).id,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new createError.Unauthorized("User not found");
    }
    req.user = user;
    next();
  } catch (error: any) {
    throw new createError.Unauthorized(
      error?.message || "Invalid access token"
    );
  }
};
