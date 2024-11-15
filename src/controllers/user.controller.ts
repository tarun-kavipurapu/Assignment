import { NextFunction, Request, Response } from "express";
import { UserInterface } from "../types";
import createError from "http-errors";
import prismaClient from "../config/prismaClient";
import {
  comparePassword,
  generateAccessToken,
  hashPassword,
} from "../utils/JWT";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}

export class UserController {
  public signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existedUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existedUser) throw new createError.Conflict("User already exists");

    const hashedPassword = await hashPassword(password);
    const user = await prismaClient.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true },
    });

    if (!user) throw new createError.InternalServerError("Error creating User");

    res
      .status(201)
      .json(new ApiResponse(200, { user }, "Users registered successfully."));
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prismaClient.user.findUnique({
      where: { email },
    });
    if (!user) throw new createError.NotFound("User not found");

    const isSame = await comparePassword(password, user.password);
    if (!isSame) throw new createError.Unauthorized("Invalid password");

    const accessToken = await generateAccessToken(user);
    const userSend = await prismaClient.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true },
    });

    const options = {
      httpOnly: true,
      // secure: NODE_ENV === "production",
      // sameSite: "Strict",
      // maxAge: 24 * 60 * 60 * 1000,
    };

    res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userSend, accessToken },
          "Users Login successfully."
        )
      );
  });
}
