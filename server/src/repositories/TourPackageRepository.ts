import { Pool, QueryResult } from "pg";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { BaseRepository } from "./BaseRepository";
import { TourPackage } from "../models/TourPackage";

/**
 * Репозиторий для работы с туристическими путевками
 */
export class TourPackageRepository extends BaseRepository<TourPackage> {
    protected tableName = "tour_packages";

    protected mapRowToModel(row: any): TourPackage {
        return new TourPackage({
            id: row.id,
            destination: row.destination,
            startDate: row.start_date,
            duration: row.duration,
            price: row.price,
            transport: row.transport,
            accommodation: row.accommodation,
            destinationTypeId: row.destination_type_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }

    public async create(entity: Partial<TourPackage>): Promise<TourPackage> {
        const query = `
            INSERT INTO ${this.tableName} 
            (destination, start_date, duration, price, transport, accommodation, destination_type_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const result: QueryResult = await this.pool.query(query, [
            entity.destination,
            entity.startDate,
            entity.duration,
            entity.price,
            entity.transport,
            entity.accommodation,
            entity.destinationTypeId,
        ]);

        return this.mapRowToModel(result.rows[0]);
    }

    public async update(id: number, entity: Partial<TourPackage>): Promise<TourPackage | null> {
        const updates: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (entity.destination !== undefined) {
            updates.push(`destination = $${paramCount++}`);
            values.push(entity.destination);
        }
        if (entity.startDate !== undefined) {
            updates.push(`start_date = $${paramCount++}`);
            values.push(entity.startDate);
        }
        if (entity.duration !== undefined) {
            updates.push(`duration = $${paramCount++}`);
            values.push(entity.duration);
        }
        if (entity.price !== undefined) {
            updates.push(`price = $${paramCount++}`);
            values.push(entity.price);
        }
        if (entity.transport !== undefined) {
            updates.push(`transport = $${paramCount++}`);
            values.push(entity.transport);
        }
        if (entity.accommodation !== undefined) {
            updates.push(`accommodation = $${paramCount++}`);
            values.push(entity.accommodation);
        }
        if (entity.destinationTypeId !== undefined) {
            updates.push(`destination_type_id = $${paramCount++}`);
            values.push(entity.destinationTypeId);
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

    /**
     * Найти путевки по типу направления
     */
    public async findByDestinationType(destinationTypeId: number): Promise<TourPackage[]> {
        const query = `SELECT * FROM ${this.tableName} WHERE destination_type_id = $1 ORDER BY id`;
        const result: QueryResult = await this.pool.query(query, [destinationTypeId]);
        return result.rows.map((row) => this.mapRowToModel(row));
    }

    /**
     * Получить среднюю стоимость по типу направления
     */
    public async getAveragePriceByDestinationType(destinationTypeId: number): Promise<number> {
        const query = `
            SELECT AVG(price) as avg_price 
            FROM ${this.tableName} 
            WHERE destination_type_id = $1
        `;
        const result: QueryResult = await this.pool.query(query, [destinationTypeId]);
        return parseFloat(result.rows[0]?.avg_price || "0");
    }
}
