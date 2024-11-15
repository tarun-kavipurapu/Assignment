import { Application } from "express";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { userRoutes } from "./user.routes";

// const swaggerDocument = YAML.load("./src/api.yaml");

export const initializeRoutes = (app: Application) => {
  //   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/user", userRoutes.routes());
};
