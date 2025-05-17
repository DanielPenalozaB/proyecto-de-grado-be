import { Router } from 'express';
import { create, remove, getAll, getById, update } from './guides.service';

const guidesRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Guide:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the guide
 *           example: 1
 *         name:
 *           type: string
 *           description: Name of the guide
 *           example: "Water Harvesting Methods"
 *         description:
 *           type: string
 *           description: Detailed description of the guide
 *           example: "Learn various methods to harvest water efficiently"
 *         difficulty:
 *           $ref: '#/components/schemas/GuideDifficulty'
 *         estimatedDuration:
 *           type: integer
 *           description: Estimated duration in minutes
 *           example: 120
 *         status:
 *           $ref: '#/components/schemas/GuideStatus'
 *         language:
 *           $ref: '#/components/schemas/Languages'
 *         points:
 *           type: integer
 *           description: Points awarded for completing the guide
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     GuideDifficulty:
 *       type: string
 *       enum: [beginner, intermediate, advanced]
 *       description: Difficulty level of the guide
 *       example: "intermediate"
 *     GuideStatus:
 *       type: string
 *       enum: [draft, published, archived]
 *       description: Publication status of the guide
 *       example: "published"
 *     CreateGuideDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - difficulty
 *         - estimatedDuration
 *         - status
 *         - language
 *         - points
 *       properties:
 *         name:
 *           type: string
 *           example: "Water Harvesting Methods"
 *         description:
 *           type: string
 *           example: "Learn various methods to harvest water efficiently"
 *         difficulty:
 *           $ref: '#/components/schemas/GuideDifficulty'
 *         estimatedDuration:
 *           type: integer
 *           example: 120
 *         status:
 *           $ref: '#/components/schemas/GuideStatus'
 *         language:
 *           $ref: '#/components/schemas/Languages'
 *         points:
 *           type: integer
 *           example: 100
 *     UpdateGuideDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Advanced Water Harvesting"
 *         description:
 *           type: string
 *           example: "Updated guide with advanced techniques"
 *         difficulty:
 *           $ref: '#/components/schemas/GuideDifficulty'
 *         estimatedDuration:
 *           type: integer
 *           example: 150
 *         status:
 *           $ref: '#/components/schemas/GuideStatus'
 *         language:
 *           $ref: '#/components/schemas/Languages'
 *         points:
 *           type: integer
 *           example: 150
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         pageCount:
 *           type: integer
 *           example: 5
 *         total:
 *           type: integer
 *           example: 50
 *         hasNextPage:
 *           type: boolean
 *           example: true
 *         hasPreviousPage:
 *           type: boolean
 *           example: false
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Error message"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               property:
 *                 type: string
 *               constraints:
 *                 type: object
 *   parameters:
 *     GuideIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The ID of the guide
 */

/**
 * @swagger
 * tags:
 *   name: Guides
 *   description: Guide management endpoints
 */

/**
 * @swagger
 * /guides:
 *   get:
 *     summary: List all guides
 *     description: Retrieve a paginated list of guides with filtering options
 *     tags: [Guides]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortDirectionQuery'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, difficulty, estimatedDuration, points, createdAt, updatedAt]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or description
 *       - in: query
 *         name: difficulty
 *         schema:
 *           $ref: '#/components/schemas/GuideDifficulty'
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/GuideStatus'
 *       - in: query
 *         name: language
 *         schema:
 *           $ref: '#/components/schemas/Languages'
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum duration in minutes
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum duration in minutes
 *     responses:
 *       200:
 *         description: A paginated list of guides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Guide'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
guidesRouter.get('/', getAll);

/**
 * @swagger
 * /guides/{id}:
 *   get:
 *     summary: Get a guide by ID
 *     description: Retrieve detailed information about a specific guide including its modules
 *     tags: [Guides]
 *     parameters:
 *       - $ref: '#/components/parameters/GuideIdParam'
 *     responses:
 *       200:
 *         description: Guide details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Guide'
 *       404:
 *         description: Guide not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
guidesRouter.get('/:id', getById);

/**
 * @swagger
 * /guides:
 *   post:
 *     summary: Create a new guide
 *     description: Create a new guide with the provided information
 *     tags: [Guides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGuideDto'
 *     responses:
 *       201:
 *         description: Guide created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Guide'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
guidesRouter.post('/', create);

/**
 * @swagger
 * /guides/{id}:
 *   put:
 *     summary: Update a guide
 *     description: Update an existing guide with the provided information
 *     tags: [Guides]
 *     parameters:
 *       - $ref: '#/components/parameters/GuideIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGuideDto'
 *     responses:
 *       200:
 *         description: Guide updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Guide'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Guide not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
guidesRouter.put('/:id', update);

/**
 * @swagger
 * /guides/{id}:
 *   delete:
 *     summary: Delete a guide
 *     description: Soft delete a guide (mark as deleted without permanent removal)
 *     tags: [Guides]
 *     parameters:
 *       - $ref: '#/components/parameters/GuideIdParam'
 *     responses:
 *       200:
 *         description: Guide deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide deleted successfully"
 *       404:
 *         description: Guide not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Guide not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
guidesRouter.delete('/:id', remove);

export default guidesRouter;