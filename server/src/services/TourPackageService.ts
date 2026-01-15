import { TourPackageRepository } from "../repositories/TourPackageRepository";
import { TourPackage } from "../models/TourPackage";

/**
 * Сервисный слой для работы с туристическими путевками
 */
export class TourPackageService {
    private repository: TourPackageRepository;

    constructor() {
        this.repository = new TourPackageRepository();
    }

    public async getAllTourPackages(): Promise<TourPackage[]> {
        return await this.repository.findAll();
    }

    public async getTourPackageById(id: number): Promise<TourPackage | null> {
        if (id <= 0) {
            throw new Error("Invalid tour package ID");
        }
        return await this.repository.findById(id);
    }

    public async getTourPackagesByDestinationType(destinationTypeId: number): Promise<TourPackage[]> {
        if (destinationTypeId <= 0) {
            throw new Error("Invalid destination type ID");
        }
        return await this.repository.findByDestinationType(destinationTypeId);
    }

    public async getAveragePriceByDestinationType(destinationTypeId: number): Promise<number> {
        if (destinationTypeId <= 0) {
            throw new Error("Invalid destination type ID");
        }
        return await this.repository.getAveragePriceByDestinationType(destinationTypeId);
    }

    public async createTourPackage(data: Partial<TourPackage>): Promise<TourPackage> {
        if (!data.destination || data.destination.trim().length === 0) {
            throw new Error("Destination is required");
        }
        if (!data.startDate) {
            throw new Error("Start date is required");
        }
        if (!data.duration || data.duration <= 0) {
            throw new Error("Valid duration is required");
        }
        if (!data.price || data.price <= 0) {
            throw new Error("Valid price is required");
        }
        if (!data.destinationTypeId || data.destinationTypeId <= 0) {
            throw new Error("Valid destination type ID is required");
        }

        return await this.repository.create(data);
    }

    public async updateTourPackage(id: number, data: Partial<TourPackage>): Promise<TourPackage | null> {
        if (id <= 0) {
            throw new Error("Invalid tour package ID");
        }

        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Tour package not found");
        }

        return await this.repository.update(id, data);
    }

    public async deleteTourPackage(id: number): Promise<boolean> {
        if (id <= 0) {
            throw new Error("Invalid tour package ID");
        }

        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new Error("Tour package not found");
        }

        return await this.repository.delete(id);
    }
}
