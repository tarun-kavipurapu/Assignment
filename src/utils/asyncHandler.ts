import { NextFunction, Request, Response } from "express";
import { UserInterface } from "../types";
declare global {
  namespace Express {
    interface Request {
      user: UserInterface;
    }
  }
}

const asyncHandler = (requestHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
