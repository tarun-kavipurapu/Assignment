import express, { Application } from "express";
import prisma from "./config/prismaClient";
import { config } from "./config";
import { errorHandler } from "./middleware/errorHandler";

const init = async () => {
  const app: Application = express();
  config.verifyConfig();

  app.use(errorHandler);
};

init();
