import pino from "pino";
import { config } from "./index";

export const l = pino({
  name: "car-managment",
  level: config.LOG_LEVEL,
});
