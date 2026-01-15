import { Request, Response } from "express";
import { TourPackageService } from "../services/TourPackageService";

/**
 * Контроллер для обработки HTTP запросов связанных с туристическими путевками
 */
export class TourPackageController {
    private tourPackageService: TourPackageService;

    constructor() {
        this.tourPackageService = new TourPackageService();
    }

    public getAllTourPackages = async (_req: Request, res: Response): Promise<void> => {
        try {
            const tourPackages = await this.tourPackageService.getAllTourPackages();
            res.status(200).json({
                success: true,
                data: tourPackages,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch tour packages",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };

    public getTourPackageById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
            const tourPackage = await this.tourPackageService.getTourPackageById(id);

            if (!tourPackage) {
                res.status(404).json({
                    success: false,
                    message: "Tour package not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: tourPackage,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    };

    public getTourPackagesByDestinationType = async (req: Request, res: Response): Promise<void> => {
        try {
            const destinationTypeId = parseInt(
                Array.isArray(req.params.destinationTypeId)
                    ? req.params.destinationTypeId[0]
                    : req.params.destinationTypeId,
                10
            );
            const tourPackages = await this.tourPackageService.getTourPackagesByDestinationType(
                destinationTypeId
            );

            res.status(200).json({
                success: true,
                data: tourPackages,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    };

    public getAveragePriceByDestinationType = async (req: Request, res: Response): Promise<void> => {
        try {
            const destinationTypeId = parseInt(
                Array.isArray(req.params.destinationTypeId)
                    ? req.params.destinationTypeId[0]
                    : req.params.destinationTypeId,
                10
            );
            const averagePrice = await this.tourPackageService.getAveragePriceByDestinationType(
                destinationTypeId
            );

            res.status(200).json({
                success: true,
                data: {
                    destinationTypeId: destinationTypeId,
                    averagePrice: averagePrice,
                },
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    };

    public createTourPackage = async (req: Request, res: Response): Promise<void> => {
        try {
            const tourPackage = await this.tourPackageService.createTourPackage(req.body);
            res.status(201).json({
                success: true,
                data: tourPackage,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to create tour package",
            });
        }
    };

    public updateTourPackage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
            const tourPackage = await this.tourPackageService.updateTourPackage(id, req.body);

            if (!tourPackage) {
                res.status(404).json({
                    success: false,
                    message: "Tour package not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: tourPackage,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to update tour package",
            });
        }
    };

    public deleteTourPackage = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
            const deleted = await this.tourPackageService.deleteTourPackage(id);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: "Tour package not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Tour package deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete tour package",
            });
        }
    };
}
