import { app } from "./app";
import { config } from "./config";
import { DatabaseConnection } from "./database/DatabaseConnection";

const PORT = config.app.port;
const HOST = config.app.host;

async function startServer() {
    try {
        // Проверка подключения к БД
        const db = DatabaseConnection.getInstance();
        const isConnected = await db.testConnection();

        if (!isConnected) {
            console.error("❌ Failed to connect to database");
            process.exit(1);
        }

        console.log("✅ Database connection established");

        // Запуск сервера
        app.listen(PORT, HOST, () => {
            console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
            console.log(`📊 Environment: ${config.app.env}`);
            console.log(`📡 API available at http://${HOST}:${PORT}/api`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing HTTP server");
    const db = DatabaseConnection.getInstance();
    await db.close();
    process.exit(0);
});

process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing HTTP server");
    const db = DatabaseConnection.getInstance();
    await db.close();
    process.exit(0);
});
