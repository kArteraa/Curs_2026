import { Router } from "express";
import { TourPackageController } from "../../controllers/TourPackageController";

const router = Router();
const tourPackageController = new TourPackageController();

/**
 * @swagger
 * /api/tour-packages:
 *   get:
 *     summary: Получить все туристические путевки
 *     tags: [Tour Packages]
 *     responses:
 *       200:
 *         description: Список путевок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TourPackage'
 */
router.get("/", tourPackageController.getAllTourPackages);

/**
 * @swagger
 * /api/tour-packages/destination-type/{destinationTypeId}:
 *   get:
 *     summary: Получить путевки по типу направления
 *     tags: [Tour Packages]
 *     parameters:
 *       - in: path
 *         name: destinationTypeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID типа направления
 *     responses:
 *       200:
 *         description: Список путевок для указанного типа направления
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TourPackage'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/destination-type/:destinationTypeId", tourPackageController.getTourPackagesByDestinationType);

/**
 * @swagger
 * /api/tour-packages/destination-type/{destinationTypeId}/average-price:
 *   get:
 *     summary: Получить среднюю стоимость путевок по типу направления
 *     tags: [Tour Packages]
 *     parameters:
 *       - in: path
 *         name: destinationTypeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID типа направления
 *     responses:
 *       200:
 *         description: Средняя стоимость путевок
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     destinationTypeId:
 *                       type: integer
 *                     averagePrice:
 *                       type: number
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
    "/destination-type/:destinationTypeId/average-price",
    tourPackageController.getAveragePriceByDestinationType
);

/**
 * @swagger
 * /api/tour-packages/{id}:
 *   get:
 *     summary: Получить путевку по ID
 *     tags: [Tour Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID путевки
 *     responses:
 *       200:
 *         description: Путевка найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TourPackage'
 *       404:
 *         description: Путевка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", tourPackageController.getTourPackageById);

/**
 * @swagger
 * /api/tour-packages:
 *   post:
 *     summary: Создать новую туристическую путевку
 *     tags: [Tour Packages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destination
 *               - startDate
 *               - duration
 *               - price
 *               - destinationTypeId
 *             properties:
 *               destination:
 *                 type: string
 *                 example: Сочи
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-01"
 *               duration:
 *                 type: integer
 *                 example: 7
 *               price:
 *                 type: number
 *                 example: 50000
 *               transport:
 *                 type: string
 *                 example: Самолет
 *               accommodation:
 *                 type: string
 *                 example: Отель 4*
 *               destinationTypeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Путевка создана
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TourPackage'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", tourPackageController.createTourPackage);

/**
 * @swagger
 * /api/tour-packages/{id}:
 *   put:
 *     summary: Обновить туристическую путевку
 *     tags: [Tour Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID путевки
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               duration:
 *                 type: integer
 *               price:
 *                 type: number
 *               transport:
 *                 type: string
 *               accommodation:
 *                 type: string
 *               destinationTypeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Путевка обновлена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/TourPackage'
 *       404:
 *         description: Путевка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", tourPackageController.updateTourPackage);

/**
 * @swagger
 * /api/tour-packages/{id}:
 *   delete:
 *     summary: Удалить туристическую путевку
 *     tags: [Tour Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID путевки
 *     responses:
 *       200:
 *         description: Путевка удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Путевка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", tourPackageController.deleteTourPackage);

export default router;
