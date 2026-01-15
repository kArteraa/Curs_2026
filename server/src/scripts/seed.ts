import { DatabaseConnection } from "../database/DatabaseConnection";
import { DataFactory } from "../factories/DataFactory";
import { DestinationService } from "../services/DestinationService";
import { TourPackageService } from "../services/TourPackageService";

/**
 * Скрипт для заполнения базы данных тестовыми данными
 */
async function seedDatabase() {
    console.log("🌱 Начало заполнения базы данных...\n");

    try {
        // Инициализация подключения к БД
        const db = DatabaseConnection.getInstance();
        const connectionTest = await db.testConnection();
        if (!connectionTest) {
            throw new Error("Не удалось подключиться к базе данных");
        }
        console.log("✅ Подключение к базе данных установлено\n");

        // Инициализация сервисов
        const destinationService = new DestinationService();
        const tourPackageService = new TourPackageService();

        // 1. Создание направлений
        console.log("📋 Создание направлений...");
        const destinations: number[] = [];
        
        // Получаем список всех существующих направлений
        const existingDestinations = await destinationService.getAllDestinations();
        const existingNames = new Set(existingDestinations.map(d => d.name));
        
        // Список направлений для создания
        const destinationsToCreate = [
            { name: "Пляжный отдых", description: "Отдых на морском побережье" },
            { name: "Горнолыжный курорт", description: "Активный отдых в горах" },
            { name: "Экскурсионный тур", description: "Познавательные поездки по достопримечательностям" },
            { name: "Санаторий", description: "Оздоровительный отдых" },
        ];
        
        for (const destData of destinationsToCreate) {
            // Пропускаем, если уже существует
            if (existingNames.has(destData.name)) {
                const existing = existingDestinations.find(d => d.name === destData.name);
                if (existing?.id) {
                    destinations.push(existing.id);
                    console.log(`  ⊙ Направление уже существует: ${destData.name} (ID: ${existing.id})`);
                }
                continue;
            }
            
            // Создаем новое направление
            try {
                const destination = await destinationService.createDestination(destData);
                if (destination.id) {
                    destinations.push(destination.id);
                    console.log(`  ✓ Создано направление: ${destination.name} (ID: ${destination.id})`);
                } else {
                    console.error(`  ✗ Ошибка: направление создано без ID`);
                }
            } catch (error: any) {
                // Если ошибка уникальности, пытаемся найти существующее
                if (error.code === '23505' || error.constraint === 'destinations_name_key') {
                    const existing = existingDestinations.find(d => d.name === destData.name);
                    if (existing?.id) {
                        destinations.push(existing.id);
                        console.log(`  ⊙ Направление уже существует: ${destData.name} (ID: ${existing.id})`);
                    } else {
                        console.error(`  ✗ Ошибка при создании направления "${destData.name}":`, error.message);
                    }
                } else {
                    console.error(`  ✗ Ошибка при создании направления "${destData.name}":`, error.message);
                }
            }
        }
        console.log("");

        // 2. Создание туристических путевок
        console.log("✈️  Создание туристических путевок...");
        let totalPackages = 0;
        for (const destinationTypeId of destinations) {
            const destination = await destinationService.getDestinationById(destinationTypeId);
            if (!destination) continue;

            // Создаем по 5-8 путевок для каждого направления
            const packageCount = 5 + Math.floor(Math.random() * 4);
            for (let i = 0; i < packageCount; i++) {
                const packageData = DataFactory.createTourPackage(destinationTypeId);
                const tourPackage = await tourPackageService.createTourPackage(packageData);
                totalPackages++;
                console.log(
                    `  ✓ Создана путевка: ${tourPackage.destination} (${tourPackage.duration} дней, ${tourPackage.price} руб.)`
                );
            }
        }
        console.log("");

        console.log("✨ Заполнение базы данных завершено успешно!");
        console.log("\n📊 Статистика:");
        console.log(`  - Направлений: ${destinations.length}`);
        console.log(`  - Туристических путевок: ${totalPackages}`);

        // Закрытие подключения
        await db.close();
        process.exit(0);
    } catch (error) {
        console.error("💥 Критическая ошибка при заполнении базы данных:", error);
        process.exit(1);
    }
}

// Запуск скрипта
seedDatabase();
