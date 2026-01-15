import swaggerJsdoc from "swagger-jsdoc";
import config from "./config";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Tour Packages API",
            version: "1.0.0",
            description: "API для управления туристическими путевками. Поддерживает работу с направлениями и путевками, включая усреднение стоимости по типам направлений.",
            contact: {
                name: "API Support",
            },
        },
        servers: [
            {
                url: `http://${config.app.host}:${config.app.port}`,
                description: `${config.app.env} server`,
            },
        ],
        components: {
            schemas: {
                Error: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        message: {
                            type: "string",
                            example: "Error message",
                        },
                        error: {
                            type: "string",
                            example: "Detailed error information",
                        },
                    },
                },
                Destination: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1,
                        },
                        name: {
                            type: "string",
                            example: "Пляжный отдых",
                        },
                        description: {
                            type: "string",
                            example: "Отдых на морском побережье",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                TourPackage: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            example: 1,
                        },
                        destination: {
                            type: "string",
                            example: "Сочи",
                        },
                        startDate: {
                            type: "string",
                            format: "date",
                            example: "2024-07-01",
                        },
                        duration: {
                            type: "integer",
                            example: 7,
                        },
                        price: {
                            type: "number",
                            example: 50000,
                        },
                        transport: {
                            type: "string",
                            example: "Самолет",
                        },
                        accommodation: {
                            type: "string",
                            example: "Отель 4*",
                        },
                        destinationTypeId: {
                            type: "integer",
                            example: 1,
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                        },
                    },
                },
                SuccessResponse: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        data: {
                            type: "object",
                        },
                    },
                },
            },
        },
    },
    apis: [
        "./src/api/routes/*.ts",
        "./src/controllers/*.ts",
        "./dist/api/routes/*.js",
        "./dist/controllers/*.js",
    ],
};

export const swaggerSpec = swaggerJsdoc(options);
