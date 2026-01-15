import { TourPackageService } from "../TourPackageService";
import { TourPackageRepository } from "../../repositories/TourPackageRepository";
import { DatabaseConnection } from "../../database/DatabaseConnection";

// Мокируем репозиторий
jest.mock("../../repositories/TourPackageRepository");

describe("TourPackageService - Вычисления и валидация", () => {
    let service: TourPackageService;
    let mockRepository: jest.Mocked<TourPackageRepository>;

    beforeEach(() => {
        // Создаем мок репозитория
        mockRepository = {
            getAveragePriceByDestinationType: jest.fn(),
            findByDestinationType: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as any;

        // Заменяем создание репозитория в сервисе
        (TourPackageRepository as jest.Mock).mockImplementation(() => mockRepository);
        service = new TourPackageService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAveragePriceByDestinationType", () => {
        it("должен правильно вычислять среднюю цену через репозиторий", async () => {
            // Arrange
            const destinationTypeId = 1;
            const expectedAverage = 25000.50;
            mockRepository.getAveragePriceByDestinationType.mockResolvedValue(expectedAverage);

            // Act
            const result = await service.getAveragePriceByDestinationType(destinationTypeId);

            // Assert
            expect(result).toBe(expectedAverage);
            expect(mockRepository.getAveragePriceByDestinationType).toHaveBeenCalledWith(
                destinationTypeId
            );
            expect(mockRepository.getAveragePriceByDestinationType).toHaveBeenCalledTimes(1);
        });

        it("должен выбрасывать ошибку при невалидном ID типа направления", async () => {
            // Arrange
            const invalidId = 0;

            // Act & Assert
            await expect(
                service.getAveragePriceByDestinationType(invalidId)
            ).rejects.toThrow("Invalid destination type ID");

            expect(mockRepository.getAveragePriceByDestinationType).not.toHaveBeenCalled();
        });

        it("должен выбрасывать ошибку при отрицательном ID типа направления", async () => {
            // Arrange
            const invalidId = -1;

            // Act & Assert
            await expect(
                service.getAveragePriceByDestinationType(invalidId)
            ).rejects.toThrow("Invalid destination type ID");

            expect(mockRepository.getAveragePriceByDestinationType).not.toHaveBeenCalled();
        });
    });

    describe("createTourPackage - валидация вычислений", () => {
        it("должен проверять, что цена больше 0", async () => {
            // Arrange
            const invalidData = {
                destination: "Сочи",
                startDate: new Date("2024-07-01"),
                duration: 7,
                price: 0, // Невалидная цена
                destinationTypeId: 1,
            };

            // Act & Assert
            await expect(service.createTourPackage(invalidData)).rejects.toThrow(
                "Valid price is required"
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it("должен проверять, что длительность больше 0", async () => {
            // Arrange
            const invalidData = {
                destination: "Сочи",
                startDate: new Date("2024-07-01"),
                duration: 0, // Невалидная длительность
                price: 50000,
                destinationTypeId: 1,
            };

            // Act & Assert
            await expect(service.createTourPackage(invalidData)).rejects.toThrow(
                "Valid duration is required"
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });

        it("должен проверять, что destinationTypeId больше 0", async () => {
            // Arrange
            const invalidData = {
                destination: "Сочи",
                startDate: new Date("2024-07-01"),
                duration: 7,
                price: 50000,
                destinationTypeId: 0, // Невалидный ID
            };

            // Act & Assert
            await expect(service.createTourPackage(invalidData)).rejects.toThrow(
                "Valid destination type ID is required"
            );
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
    });
});
