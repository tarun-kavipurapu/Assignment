import swaggerJsdoc from "swagger-jsdoc";
import { config } from ".";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Car Managment API",
      version: "1.0.0",
      description: "API for Car Managment System",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDoc = swaggerJsdoc(options);

export default swaggerDoc;
