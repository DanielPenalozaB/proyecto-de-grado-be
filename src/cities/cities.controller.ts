import { Router } from 'express';
import { create, remove, getAll, getById, update } from './cities.service';

const citiesRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The city ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The city name
 *           example: New York
 *         description:
 *           type: string
 *           description: City description
 *           example: The most populous city in the United States
 *         rainfall:
 *           type: number
 *           description: Rainfall in mm
 *           example: 1200
 *         language:
 *           type: string
 *           enum: [es, en]
 *           description: Primary language
 *           example: es
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CreateCityDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: City name
 *           example: New York
 *         description:
 *           type: string
 *           description: City description
 *           example: The most populous city in the United States
 *         rainfall:
 *           type: number
 *           description: Rainfall in mm
 *           example: 1200
 *         language:
 *           type: string
 *           enum: [es, en]
 *           description: Primary language
 *           example: es
 *     UpdateCityDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: City name
 *           example: New York
 *         description:
 *           type: string
 *           description: City description
 *           example: The most populous city in the United States
 *         rainfall:
 *           type: number
 *           description: Rainfall in mm
 *           example: 1200
 *         language:
 *           type: string
 *           enum: [es, en]
 *           description: Primary language
 *           example: es
 *   parameters:
 *     IdParam:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: The city ID
 */

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: City management API
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get paginated list of cities
 *     description: Retrieves a paginated list of cities with filtering and sorting options
 *     tags: [Cities]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *       - $ref: '#/components/parameters/SortDirectionQuery'
 *       - $ref: '#/components/parameters/SortByQuery'
 *       - $ref: '#/components/parameters/SearchQuery'
 *     responses:
 *       200:
 *         description: A paginated list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/City'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         pageCount:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPreviousPage:
 *                           type: boolean
 *                     sort:
 *                       type: object
 *                       properties:
 *                         by:
 *                           type: string
 *                         direction:
 *                           type: string
 *       400:
 *         description: Bad request, invalid parameters
 *       500:
 *         description: Server error
 */
citiesRouter.get('/', getAll);

/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     description: Retrieves detailed information about a specific city
 *     tags: [Cities]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: City details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
citiesRouter.get('/:id', getById);

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new city
 *     description: Creates a new city record
 *     tags: [Cities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCityDto'
 *     responses:
 *       201:
 *         description: City created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request, validation error or city already exists
 *       500:
 *         description: Server error
 */
citiesRouter.post('/', create);

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update a city
 *     description: Updates an existing city's information
 *     tags: [Cities]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCityDto'
 *     responses:
 *       200:
 *         description: City updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/City'
 *       400:
 *         description: Bad request, validation error or city name already exists
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
citiesRouter.put('/:id', update);

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city
 *     description: Soft-deletes a city from the system
 *     tags: [Cities]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 *       500:
 *         description: Server error
 */
citiesRouter.delete('/:id', remove);

export default citiesRouter;