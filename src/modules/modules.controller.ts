import { Router } from 'express';
import { create, remove, getAll, getById, update } from './modules.service';

const modulesRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Water Basics"
 *         description:
 *           type: string
 *           example: "Fundamentals of water conservation"
 *         order:
 *           type: integer
 *           example: 1
 *         points:
 *           type: integer
 *           example: 30
 *         status:
 *           $ref: '#/components/schemas/ModuleStatus'
 *         guideId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ModuleStatus:
 *       type: string
 *       enum: [draft, published, archived]
 *       example: "published"
 *     CreateModuleDto:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - order
 *         - points
 *         - status
 *         - guideId
 *       properties:
 *         name:
 *           type: string
 *           example: "Water Basics"
 *         description:
 *           type: string
 *           example: "Fundamentals of water conservation"
 *         order:
 *           type: integer
 *           example: 1
 *         points:
 *           type: integer
 *           example: 30
 *         status:
 *           $ref: '#/components/schemas/ModuleStatus'
 *         guideId:
 *           type: integer
 *           example: 1
 *     UpdateModuleDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Advanced Water Basics"
 *         description:
 *           type: string
 *           example: "Updated fundamentals of water conservation"
 *         order:
 *           type: integer
 *           example: 2
 *         points:
 *           type: integer
 *           example: 40
 *         status:
 *           $ref: '#/components/schemas/ModuleStatus'
 *         guideId:
 *           type: integer
 *           example: 1
 *   parameters:
 *     ModuleIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The ID of the module
 */

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Module management endpoints
 */

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: List all modules
 *     description: Retrieve a paginated list of modules with filtering options
 *     tags: [Modules]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortDirectionQuery'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, order, points, createdAt, updatedAt]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name or description
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/ModuleStatus'
 *       - in: query
 *         name: guideId
 *         schema:
 *           type: integer
 *         description: Filter by guide ID
 *       - in: query
 *         name: minPoints
 *         schema:
 *           type: integer
 *         description: Minimum points value
 *       - in: query
 *         name: maxPoints
 *         schema:
 *           type: integer
 *         description: Maximum points value
 *     responses:
 *       200:
 *         description: A paginated list of modules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Module'
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
 */
modulesRouter.get('/', getAll);

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Get a module by ID
 *     description: Retrieve detailed information about a specific module including its questions
 *     tags: [Modules]
 *     parameters:
 *       - $ref: '#/components/parameters/ModuleIdParam'
 *     responses:
 *       200:
 *         description: Module details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */
modulesRouter.get('/:id', getById);

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module
 *     description: Create a new module within a guide
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateModuleDto'
 *     responses:
 *       201:
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Module created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       400:
 *         description: Validation error or invalid guide ID
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Internal server error
 */
modulesRouter.post('/', create);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module
 *     description: Update an existing module with the provided information
 *     tags: [Modules]
 *     parameters:
 *       - $ref: '#/components/parameters/ModuleIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateModuleDto'
 *     responses:
 *       200:
 *         description: Module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Module updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Module or Guide not found
 *       500:
 *         description: Internal server error
 */
modulesRouter.put('/:id', update);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     description: Soft delete a module (mark as deleted without permanent removal)
 *     tags: [Modules]
 *     parameters:
 *       - $ref: '#/components/parameters/ModuleIdParam'
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Module deleted successfully"
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */
modulesRouter.delete('/:id', remove);

export default modulesRouter;