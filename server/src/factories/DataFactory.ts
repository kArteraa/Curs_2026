import { Destination } from "../models/Destination";
import { TourPackage } from "../models/TourPackage";

/**
 * Фабрика данных (Factory Pattern)
 * Генерирует тестовые данные для заполнения базы данных
 */
export class DataFactory {
    private static readonly DESTINATIONS = [
        { name: "Пляжный отдых", description: "Отдых на морском побережье" },
        { name: "Горнолыжный курорт", description: "Активный отдых в горах" },
        { name: "Экскурсионный тур", description: "Познавательные поездки по достопримечательностям" },
        { name: "Санаторий", description: "Оздоровительный отдых" },
    ];

    private static readonly DESTINATION_PLACES = [
        "Сочи", "Крым", "Турция", "Египет", "ОАЭ", "Таиланд", "Болгария", "Греция",
    ];

    private static readonly TRANSPORT_TYPES = [
        "Самолет", "Поезд", "Автобус", "Паром",
    ];

    private static readonly ACCOMMODATION_TYPES = [
        "Отель 3*", "Отель 4*", "Отель 5*", "Апартаменты", "Санаторий", "База отдыха",
    ];

    /**
     * Создать направление
     */
    static createDestination(data?: Partial<Destination>): Partial<Destination> {
        const destination = this.DESTINATIONS[Math.floor(Math.random() * this.DESTINATIONS.length)];
        return {
            name: data?.name || destination.name,
            description: data?.description || destination.description,
        };
    }

    /**
     * Создать туристическую путевку
     */
    static createTourPackage(destinationTypeId: number, data?: Partial<TourPackage>): Partial<TourPackage> {
        const destination = this.DESTINATION_PLACES[Math.floor(Math.random() * this.DESTINATION_PLACES.length)];
        const transport = this.TRANSPORT_TYPES[Math.floor(Math.random() * this.TRANSPORT_TYPES.length)];
        const accommodation = this.ACCOMMODATION_TYPES[Math.floor(Math.random() * this.ACCOMMODATION_TYPES.length)];
        
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() + Math.floor(Math.random() * 6));
        startDate.setDate(1 + Math.floor(Math.random() * 28));
        
        const duration = 3 + Math.floor(Math.random() * 14); // 3-17 дней
        const basePrice = 20000 + Math.floor(Math.random() * 80000); // 20000-100000

        return {
            destination: data?.destination || destination,
            startDate: data?.startDate || startDate,
            duration: data?.duration || duration,
            price: data?.price || basePrice,
            transport: data?.transport || transport,
            accommodation: data?.accommodation || accommodation,
            destinationTypeId: destinationTypeId,
        };
    }
}
