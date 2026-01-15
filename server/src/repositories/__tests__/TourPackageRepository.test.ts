import { TourPackageRepository } from "../TourPackageRepository";
import { DatabaseConnection } from "../../database/DatabaseConnection";
import { TourPackage } from "../../models/TourPackage";

describe("TourPackageRepository - Вычисления", () => {
    let repository: TourPackageRepository;
    let testDestinationTypeId: number;

    beforeAll(async () => {
        // Инициализация подключения к БД
        const db = DatabaseConnection.getInstance();
        await db.testConnection();
        repository = new TourPackageRepository();

        // Создаем тестовое направление для тестов
        const pool = db.getPool();
        const destResult = await pool.query(
            `INSERT INTO destinations (name, description) 
             VALUES ($1, $2) 
             ON CONFLICT (name) DO NOTHING
             RETURNING id`,
            ["Тестовое направление для вычислений", "Для тестов"]
        );
        
        if (destResult.rows.length > 0) {
            testDestinationTypeId = destResult.rows[0].id;
        } else {
            // Если уже существует, получаем его ID
            const existing = await pool.query(
                `SELECT id FROM destinations WHERE name = $1`,
                ["Тестовое направление для вычислений"]
            );
            testDestinationTypeId = existing.rows[0].id;
        }
    });

    afterAll(async () => {
        // Очистка тестовых данных
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
        // Очистка перед каждым тестом
        const pool = DatabaseConnection.getInstance().getPool();
        await pool.query(
            `DELETE FROM tour_packages WHERE destination_type_id = $1`,
            [testDestinationTypeId]
        );
    });

    describe("getAveragePriceByDestinationType", () => {
        it("должен правильно вычислять среднюю цену для нескольких путевок", async () => {
            // Arrange: создаем путевки с известными ценами
            const prices = [10000, 20000, 30000, 40000];
            const expectedAverage = (10000 + 20000 + 30000 + 40000) / 4; // 25000

            for (const price of prices) {
                await repository.create({
                    destination: "Тестовое место",
                    startDate: new Date("2024-07-01"),
                    duration: 7,
                    price: price,
                    transport: "Самолет",
                    accommodation: "Отель",
                    destinationTypeId: testDestinationTypeId,
                });
            }

            // Act: вычисляем среднюю цену
            const averagePrice = await repository.getAveragePriceByDestinationType(
                testDestinationTypeId
            );

            // Assert: проверяем результат
            expect(averagePrice).toBeCloseTo(expectedAverage, 2);
        });

        it("должен правильно вычислять среднюю цену для одной путевки", async () => {
            // Arrange: создаем одну путевку
            const price = 50000;
            await repository.create({
                destination: "Тестовое место",
                startDate: new Date("2024-07-01"),
                duration: 7,
                price: price,
                transport: "Самолет",
                accommodation: "Отель",
                destinationTypeId: testDestinationTypeId,
            });

            // Act: вычисляем среднюю цену
            const averagePrice = await repository.getAveragePriceByDestinationType(
                testDestinationTypeId
            );

            // Assert: средняя цена должна равняться цене единственной путевки
            expect(averagePrice).toBeCloseTo(price, 2);
        });

        it("должен возвращать 0 для пустого списка путевок", async () => {
            // Act: вычисляем среднюю цену для типа направления без путевок
            const averagePrice = await repository.getAveragePriceByDestinationType(
                testDestinationTypeId
            );

            // Assert: должна быть 0
            expect(averagePrice).toBe(0);
        });

        it("должен правильно вычислять среднюю цену с дробными значениями", async () => {
            // Arrange: создаем путевки с дробными ценами
            const prices = [12345.67, 23456.78, 34567.89];
            const expectedAverage = (12345.67 + 23456.78 + 34567.89) / 3; // 23456.78

            for (const price of prices) {
                await repository.create({
                    destination: "Тестовое место",
                    startDate: new Date("2024-07-01"),
                    duration: 7,
                    price: price,
                    transport: "Самолет",
                    accommodation: "Отель",
                    destinationTypeId: testDestinationTypeId,
                });
            }

            // Act: вычисляем среднюю цену
            const averagePrice = await repository.getAveragePriceByDestinationType(
                testDestinationTypeId
            );

            // Assert: проверяем результат с точностью до 2 знаков после запятой
            expect(averagePrice).toBeCloseTo(expectedAverage, 2);
        });
    });
});
