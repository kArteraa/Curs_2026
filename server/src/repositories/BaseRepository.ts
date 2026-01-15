import { Pool, QueryResult } from "pg";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { IRepository } from "./IRepository";
import { BaseModel } from "../models/BaseModel";

/**
 * Базовый репозиторий (Repository Pattern)
 * Реализует общую функциональность для работы с БД
 */
export abstract class BaseRepository<T extends BaseModel> implements IRepository<T> {
    protected pool: Pool;
    protected abstract tableName: string;

    constructor() {
        this.pool = DatabaseConnection.getInstance().getPool();
    }

    /**
     * Преобразовать строку БД в модель
     */
    protected abstract mapRowToModel(row: unknown): T;

    /**
     * Найти сущность по ID
     */
    public async findById(id: number): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result: QueryResult = await this.pool.query(query, [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToModel(result.rows[0]);
    }

    /**
     * Найти все сущности
     */
    public async findAll(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName} ORDER BY id`;
        const result: QueryResult = await this.pool.query(query);

        return result.rows.map((row) => this.mapRowToModel(row));
    }

    /**
     * Создать новую сущность
     */
    public abstract create(entity: Partial<T>): Promise<T>;

    /**
     * Обновить сущность
     */
    public abstract update(id: number, entity: Partial<T>): Promise<T | null>;

    /**
     * Удалить сущность
     */
    public async delete(id: number): Promise<boolean> {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
        const result: QueryResult = await this.pool.query(query, [id]);

        return result.rowCount !== null && result.rowCount > 0;
    }
}
