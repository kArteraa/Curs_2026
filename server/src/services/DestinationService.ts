import { DestinationRepository } from "../repositories/DestinationRepository";
import { Destination } from "../models/Destination";

/**
 * Сервисный слой для работы с направлениями
 */
export class DestinationService {
    private repository: DestinationRepository;

    constructor() {
        this.repository = new DestinationRepository();
    }

    public async getAllDestinations(): Promise<Destination[]> {
        return await this.repository.findAll();
    }

    public async getDestinationById(id: number): Promise<Destination | null> {
        if (id <= 0) {
            throw new Error("Invalid destination ID");
        }
        return await this.repository.findById(id);
    }

    public async createDestination(data: Partial<Destination>): Promise<Destination> {
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("Destination name is required");
        }

        return await this.repository.create(data);
    }

    public async updateDestination(id: number, data: Partial<Destination>): Promise<Destination | null> {
        if (id <= 0) {
            throw new Error("Invalid destination ID");
        }

        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Destination not found");
        }

        return await this.repository.update(id, data);
    }

    public async deleteDestination(id: number): Promise<boolean> {
        if (id <= 0) {
            throw new Error("Invalid destination ID");
        }

        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Destination not found");
        }

        return await this.repository.delete(id);
    }
}
