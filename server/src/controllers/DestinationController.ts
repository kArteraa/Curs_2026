import { Request, Response } from "express";
import { DestinationService } from "../services/DestinationService";

/**
 * Контроллер для обработки HTTP запросов связанных с направлениями
 */
export class DestinationController {
    private destinationService: DestinationService;

    constructor() {
        this.destinationService = new DestinationService();
    }

    public getAllDestinations = async (_req: Request, res: Response): Promise<void> => {
        try {
            const destinations = await this.destinationService.getAllDestinations();
            res.status(200).json({
                success: true,
                data: destinations,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to fetch destinations",
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };

    public getDestinationById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
            const destination = await this.destinationService.getDestinationById(id);

            if (!destination) {
                res.status(404).json({
                    success: false,
                    message: "Destination not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: destination,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    };

    public createDestination = async (req: Request, res: Response): Promise<void> => {
        try {
            const destination = await this.destinationService.createDestination(req.body);
            res.status(201).json({
                success: true,
                data: destination,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to create destination",
            });
        }
    };

    public updateDestination = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
            const destination = await this.destinationService.updateDestination(id, req.body);

            if (!destination) {
                res.status(404).json({
                    success: false,
                    message: "Destination not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: destination,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to update destination",
            });
        }
    };

    public deleteDestination = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
            const deleted = await this.destinationService.deleteDestination(id);

            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: "Destination not found",
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: "Destination deleted successfully",
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete destination",
            });
        }
    };
}
