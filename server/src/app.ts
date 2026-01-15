import express from "express";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import apiRoutes from "./api/routes";
import { swaggerSpec } from "./config/swagger";

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.cors.origin);
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (config.cors.credentials) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Health check
app.get("/", (_req, res) => {
    res.json({
        message: "Tour Packages API",
        version: "1.0.0",
        status: "running",
        docs: "/api-docs",
    });
});

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Tour Packages API Documentation",
}));

// OpenAPI JSON endpoint
app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

// API Routes
app.use("/api", apiRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Error handler
app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
    ) => {
        console.error("Error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: config.app.env === "development" ? err.message : undefined,
        });
    }
);
