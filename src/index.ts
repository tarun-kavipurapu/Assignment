import express, { Application } from "express";
import prisma from "./config/prismaClient";
import { config } from "./config";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware";
import { initializeRoutes } from "./routes/routes";
import { createServer } from "http";
import { l } from "./config/logger";

const init = async () => {
  const app: Application = express();
  config.verifyConfig();

  app.use(express.json());
  app.use(morgan("dev"));
  initializeRoutes(app);
  app.use(errorHandler);
  const httpServer = createServer(app);
  httpServer.listen(config.PORT, async () => {
    l.info(`Server is running on port ${config.PORT}`);
  });
};

init();
