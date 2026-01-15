import dotenv from "dotenv";
import { Config } from "./types";

dotenv.config();

const config: Config = {
    app: {
        host: process.env.HOST || "127.0.0.1",
        port: parseInt(process.env.PORT || "3000", 10),
        env: process.env.NODE_ENV || "development",
    },
    database: {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        name: process.env.DB_NAME || "championships_db",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        schema: process.env.DB_SCHEMA || "public",
        pool: {
            min: parseInt(process.env.DB_POOL_MIN || "2", 10),
            max: parseInt(process.env.DB_POOL_MAX || "10", 10),
        },
    },
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
        credentials: process.env.CORS_CREDENTIALS === "true",
    },
};

export default config;
