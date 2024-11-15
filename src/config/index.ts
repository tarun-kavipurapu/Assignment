import "dotenv/config";

class Config {
  public readonly PORT: number;
  public readonly DATABASE_URL: string;
  public readonly JWT_SECRET: string;
  public readonly BASE_URL: string;
  public readonly LOG_LEVEL: string;
  public readonly API_LIMIT: number = 50;
  public readonly CLOUDINARY_CLOUD_NAME: string;
  public readonly CLOUDINARY_API_KEY: string;
  public readonly CLOUDINARY_API_SECRET: string;

  constructor() {
    this.PORT = Number(process.env.PORT) || 8000;
    this.DATABASE_URL = process.env.DATABASE_URL || "";
    this.JWT_SECRET = process.env.JWT_SECRET || "";
    this.BASE_URL = process.env.BASE_URL || `http://localhost:${this.PORT}`;
    this.LOG_LEVEL = process.env.LOG_LEVEL || "info";
    this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
  }

  public verifyConfig(): void {
    const errors: string[] = [];

    const envVariables = ["DATABASE_URL", "JWT_SECRET"];

    envVariables.forEach((envVariable) => {
      if (!process.env[envVariable]) {
        errors.push(`Missing ${envVariable} in environment variables`);
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join("\n"));
    }
  }
}

export const config: Config = new Config();
