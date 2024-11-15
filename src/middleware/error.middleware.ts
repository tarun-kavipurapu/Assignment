import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue } from "zod";
import { HttpError } from "http-errors";

interface CustomErrorMessage {
  path: string;
  message: string;
}

const getCustomErrorMessage = (issue: ZodIssue): CustomErrorMessage => {
  const path = issue.path.join(".");
  let message = issue.message;

  switch (issue.code) {
    case "invalid_type":
      if (issue.expected === "string" && issue.received === "undefined") {
        message = "This field is required";
      }
      break;
    default:
      break;
  }
  return { path, message };
};

export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const customErrors: CustomErrorMessage[] = err.issues.map(
      getCustomErrorMessage
    );

    res.status(400).json({
      message: "Bad Request",
      errors: customErrors,
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: "An error has occurred",
      error: err.message,
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
    return;
  }

  next(err);
};
