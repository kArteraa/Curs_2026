import { Pool, PoolConfig } from "pg";
import { config } from "../config";

/**
 * Singleton паттерн для управления подключением к базе данных
 * Обеспечивает единственный экземпляр подключения к PostgreSQL
 */
export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private pool: Pool;

    private constructor() {
        const poolConfig: PoolConfig = {
            host: config.database.host,
            port: config.database.port,
            database: config.database.name,
            user: config.database.user,
            password: config.database.password,
            min: config.database.pool.min,
            max: config.database.pool.max,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        };

        this.pool = new Pool(poolConfig);

        // Установка схемы по умолчанию для всех подключений
        // Используем quote_ident для безопасного экранирования имени схемы
        this.pool.on("connect", async (client) => {
            const schemaName = config.database.schema;
            // Валидация имени схемы (только буквы, цифры, подчеркивания, дефисы)
            if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(schemaName)) {
                throw new Error(`Invalid database schema name: ${schemaName}`);
            }
            await client.query(`SET search_path TO ${schemaName}`);
        });

        // Обработка ошибок подключения
        this.pool.on("error", (err) => {
            console.error("Unexpected error on idle client", err);
        });
    }

    /**
     * Получить единственный экземпляр DatabaseConnection
     */
    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    /**
     * Получить пул подключений
     */
    public getPool(): Pool {
        return this.pool;
    }

    /**
     * Получить текущую схему базы данных
     */
    public getSchema(): string {
        return config.database.schema;
    }

    /**
     * Проверить подключение к базе данных
     */
    public async testConnection(): Promise<boolean> {
        try {
            const client = await this.pool.connect();
            await client.query("SELECT NOW()");
            client.release();
            return true;
        } catch (error) {
            console.error("Database connection test failed:", error);
            return false;
        }
    }

    /**
     * Закрыть все подключения
     */
    public async close(): Promise<void> {
        await this.pool.end();
    }
}
