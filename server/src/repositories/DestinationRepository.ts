import { Pool, QueryResult } from "pg";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { BaseRepository } from "./BaseRepository";
import { Destination } from "../models/Destination";

/**
 * Репозиторий для работы с направлениями
 */
export class DestinationRepository extends BaseRepository<Destination> {
    protected tableName = "destinations";

    protected mapRowToModel(row: any): Destination {
        return new Destination({
            id: row.id,
            name: row.name,
            description: row.description,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    public async create(entity: Partial<Destination>): Promise<Destination> {
        const query = `
            INSERT INTO ${this.tableName} (name, description)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result: QueryResult = await this.pool.query(query, [
            entity.name,
            entity.description,
        ]);

        return this.mapRowToModel(result.rows[0]);
    }

    public async update(id: number, entity: Partial<Destination>): Promise<Destination | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (entity.name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(entity.name);
        }
        if (entity.description !== undefined) {
            updates.push(`description = $${paramCount++}`);
            values.push(entity.description);
        }

        if (updates.length === 0) {
            return await this.findById(id);
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE ${this.tableName}
            SET ${updates.join(", ")}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result: QueryResult = await this.pool.query(query, values);

        if (result.rows.length === 0) {
            return null;
        }

        return this.mapRowToModel(result.rows[0]);
    }
}
