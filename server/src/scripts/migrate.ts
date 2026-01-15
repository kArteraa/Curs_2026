import { Pool } from "pg";
import { config } from "../config";
import * as fs from "fs";
import * as path from "path";

/**
 * Скрипт для выполнения миграций базы данных
 */
async function runMigrations() {
    console.log("🔄 Начало выполнения миграций...\n");

    const pool = new Pool({
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        user: config.database.user,
        password: config.database.password,
    });

    try {
        // Устанавливаем схему
        await pool.query(`SET search_path TO ${config.database.schema}`);

        // Читаем файл миграции
        const migrationPath = path.join(
            __dirname,
            "../../database/migrations/001_initial_schema.sql"
        );
        const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

        console.log("📄 Выполнение миграции: 001_initial_schema.sql\n");

        // Выполняем миграцию
        await pool.query(migrationSQL);

        console.log("✅ Миграция выполнена успешно!\n");

        // Проверяем, что таблицы созданы
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = $1 
            AND table_name IN ('destinations', 'tour_packages')
            ORDER BY table_name
        `, [config.database.schema]);

        console.log("📊 Созданные таблицы:");
        result.rows.forEach((row) => {
            console.log(`  ✓ ${row.table_name}`);
        });

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error("💥 Ошибка при выполнении миграции:", error);
        await pool.end();
        process.exit(1);
    }
}

// Запуск миграций
runMigrations();
