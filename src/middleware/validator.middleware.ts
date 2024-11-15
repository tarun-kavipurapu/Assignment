import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import createError from "http-errors";

const Validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next(); // If validation succeeds, move to the next middleware
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: ZodIssue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));

        // Instead of throwing, pass the error to the next middleware
        next(
          createError(400, {
            message: "Validation Error",
            errors: errorMessages,
          })
        );
      } else {
        next(createError.InternalServerError());
      }
    }
  };
};

export default Validate;
