import { Router } from "express";
import { DestinationController } from "../../controllers/DestinationController";

const router = Router();
const destinationController = new DestinationController();

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Получить все направления
 *     tags: [Destinations]
 *     responses:
 *       200:
 *         description: Список направлений
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
 *                     $ref: '#/components/schemas/Destination'
 */
router.get("/", destinationController.getAllDestinations);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Получить направление по ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID направления
 *     responses:
 *       200:
 *         description: Направление найдено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destination'
 *       404:
 *         description: Направление не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", destinationController.getDestinationById);

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Создать новое направление
 *     tags: [Destinations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Пляжный отдых
 *               description:
 *                 type: string
 *                 example: Отдых на морском побережье
 *     responses:
 *       201:
 *         description: Направление создано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Ошибка валидации
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", destinationController.createDestination);

/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Обновить направление
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID направления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Направление обновлено
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Destination'
 *       404:
 *         description: Направление не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", destinationController.updateDestination);

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Удалить направление
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID направления
 *     responses:
 *       200:
 *         description: Направление удалено
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
 *         description: Направление не найдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", destinationController.deleteDestination);

export default router;
