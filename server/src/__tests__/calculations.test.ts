import { TourPackageRepository } from "../repositories/TourPackageRepository";
import { DatabaseConnection } from "../database/DatabaseConnection";

/**
 * Интеграционные тесты для проверки вычислений
 */
describe("Вычисления - Интеграционные тесты", () => {
    let repository: TourPackageRepository;
    let testDestinationTypeId: number;

    beforeAll(async () => {
        const db = DatabaseConnection.getInstance();
        await db.testConnection();
        repository = new TourPackageRepository();

        // Создаем тестовое направление
        const pool = db.getPool();
        const destResult = await pool.query(
            `INSERT INTO destinations (name, description) 
             VALUES ($1, $2) 
             ON CONFLICT (name) DO NOTHING
             RETURNING id`,
            ["Направление для интеграционных тестов", "Тест"]
        );

        if (destResult.rows.length > 0) {
            testDestinationTypeId = destResult.rows[0].id;
        } else {
            const existing = await pool.query(
                `SELECT id FROM destinations WHERE name = $1`,
                ["Направление для интеграционных тестов"]
            );
            testDestinationTypeId = existing.rows[0].id;
        }
    });

    afterAll(async () => {
        const pool = DatabaseConnection.getInstance().getPool();
        await pool.query(
            `DELETE FROM tour_packages WHERE destination_type_id = $1`,
            [testDestinationTypeId]
        );
        await pool.query(
            `DELETE FROM destinations WHERE id = $1`,
            [testDestinationTypeId]
        );
    });

    beforeEach(async () => {
        const pool = DatabaseConnection.getInstance().getPool();
        await pool.query(
            `DELETE FROM tour_packages WHERE destination_type_id = $1`,
            [testDestinationTypeId]
        );
    });

    it("Тест 1: Вычисление средней цены для набора путевок с разными ценами", async () => {
        // Создаем путевки с ценами: 10000, 20000, 30000, 40000, 50000
        const prices = [10000, 20000, 30000, 40000, 50000];
        const expectedAverage = prices.reduce((sum, price) => sum + price, 0) / prices.length; // 30000

        for (const price of prices) {
            await repository.create({
                destination: `Место ${price}`,
                startDate: new Date("2024-07-01"),
                duration: 7,
                price: price,
                transport: "Самолет",
                accommodation: "Отель",
                destinationTypeId: testDestinationTypeId,
            });
        }

        const averagePrice = await repository.getAveragePriceByDestinationType(
            testDestinationTypeId
        );

        expect(averagePrice).toBeCloseTo(expectedAverage, 2);
        expect(averagePrice).toBe(30000);
    });

    it("Тест 2: Вычисление средней цены с учетом только путевок указанного типа", async () => {
        // Создаем другое направление
        const pool = DatabaseConnection.getInstance().getPool();
        const otherDestResult = await pool.query(
            `INSERT INTO destinations (name, description) 
             VALUES ($1, $2) 
             ON CONFLICT (name) DO NOTHING
             RETURNING id`,
            ["Другое направление для теста", "Тест"]
        );

        let otherDestinationTypeId: number;
        if (otherDestResult.rows.length > 0) {
            otherDestinationTypeId = otherDestResult.rows[0].id;
        } else {
            const existing = await pool.query(
                `SELECT id FROM destinations WHERE name = $1`,
                ["Другое направление для теста"]
            );
            otherDestinationTypeId = existing.rows[0].id;
        }

        // Создаем путевки для первого типа (должны учитываться)
        await repository.create({
            destination: "Место 1",
            startDate: new Date("2024-07-01"),
            duration: 7,
            price: 20000,
            transport: "Самолет",
            accommodation: "Отель",
            destinationTypeId: testDestinationTypeId,
        });

        await repository.create({
            destination: "Место 2",
            startDate: new Date("2024-07-01"),
            duration: 7,
            price: 30000,
            transport: "Самолет",
            accommodation: "Отель",
            destinationTypeId: testDestinationTypeId,
        });

        // Создаем путевку для другого типа (не должна учитываться)
        await repository.create({
            destination: "Другое место",
            startDate: new Date("2024-07-01"),
            duration: 7,
            price: 100000, // Высокая цена, но не должна влиять
            transport: "Самолет",
            accommodation: "Отель",
            destinationTypeId: otherDestinationTypeId,
        });

        const averagePrice = await repository.getAveragePriceByDestinationType(
            testDestinationTypeId
        );

        // Средняя должна быть только для первых двух: (20000 + 30000) / 2 = 25000
        expect(averagePrice).toBeCloseTo(25000, 2);

        // Очистка
        await pool.query(
            `DELETE FROM tour_packages WHERE destination_type_id = $1`,
            [otherDestinationTypeId]
        );
        await pool.query(
            `DELETE FROM destinations WHERE id = $1`,
            [otherDestinationTypeId]
        );
    });

    it("Тест 3: Вычисление средней цены для большого количества путевок", async () => {
        // Создаем 20 путевок с ценами от 10000 до 200000
        const prices: number[] = [];
        for (let i = 1; i <= 20; i++) {
            prices.push(10000 + i * 9500); // 19500, 29000, ..., 200000
        }

        const expectedAverage = prices.reduce((sum, price) => sum + price, 0) / prices.length; // 105000

        for (const price of prices) {
            await repository.create({
                destination: `Место ${price}`,
                startDate: new Date("2024-07-01"),
                duration: 7,
                price: price,
                transport: "Самолет",
                accommodation: "Отель",
                destinationTypeId: testDestinationTypeId,
            });
        }

        const averagePrice = await repository.getAveragePriceByDestinationType(
            testDestinationTypeId
        );

        expect(averagePrice).toBeCloseTo(expectedAverage, 2);
    });
});
