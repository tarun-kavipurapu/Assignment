import { Router } from "express";
import Validate from "../middleware/validator.middleware";
import { loginSchema, signupSchema } from "../validators";
import { UserController } from "../controllers/user.controller";

const userController = new UserController();

class UserRouter {
  public router: Router;
  constructor() {
    this.router = Router();
  }
  routes() {
    this.router.post("/signup", Validate(signupSchema), userController.signup);
    this.router.post("/login", Validate(loginSchema), userController.login);

    return this.router;
  }
}

export const userRoutes = new UserRouter();
