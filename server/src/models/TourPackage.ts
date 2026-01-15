import { BaseModel } from "./BaseModel";

/**
 * Модель туристической путевки
 */
export class TourPackage extends BaseModel {
    public destination: string; // Куда
    public startDate: Date; // Когда
    public duration: number; // Длительность в днях
    public price: number; // Стоимость
    public transport: string; // Транспорт
    public accommodation: string; // Проживание
    public destinationTypeId: number; // Тип направления для усреднения

    constructor(data: Partial<TourPackage> = {}) {
        super(data);
        this.destination = data.destination || "";
        this.startDate = data.startDate ? new Date(data.startDate) : new Date();
        this.duration = data.duration || 0;
        this.price = data.price || 0;
        this.transport = data.transport || "";
        this.accommodation = data.accommodation || "";
        this.destinationTypeId = data.destinationTypeId || 0;
    }

    public toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            destination: this.destination,
            startDate: this.startDate.toISOString().split("T")[0],
            duration: this.duration,
            price: this.price,
            transport: this.transport,
            accommodation: this.accommodation,
            destinationTypeId: this.destinationTypeId,
        };
    }
}
