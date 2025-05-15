import { Router } from 'express';
import { create, remove, getAll, getById, update, setupPassword } from './users.service';
const usersRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
 *           example: 1
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *           example: user@example.com
 *         name:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [Admin, Manager, Citizen, Operator]
 *           description: The user's role
 *           example: Citizen
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the user was last updated
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *           example: user@example.com
 *         name:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [Admin, Manager, Citizen, Operator]
 *           description: The user's role
 *           example: Citizen
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *           example: user@example.com
 *         name:
 *           type: string
 *           description: The user's full name
 *           example: John Doe
 *         role:
 *           type: string
 *           enum: [Admin, Manager, Citizen, Operator]
 *           description: The user's role
 *           example: Citizen
 *     SetPasswordDto:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           format: password
 *           description: The new password
 *           minLength: 8
 *           example: strongP@ssw0rd
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
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
 *     IdParam:
 *       in: path
 *       name: id
 *       schema:
 *         type: string
 *       required: true
 *       description: The user ID
 *     TokenParam:
 *       in: path
 *       name: token
 *       schema:
 *         type: string
 *       required: true
 *       description: The password reset token
 *     PageQuery:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *         minimum: 1
 *       required: false
 *       description: The page number
 *     limitQuery:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *         minimum: 1
 *       required: false
 *       description: Number of items per page
 *     SortDirectionQuery:
 *       in: query
 *       name: sortDirection
 *       schema:
 *         type: string
 *         enum: [ASC, DESC]
 *         default: DESC
 *       required: false
 *       description: Direction to sort results
 *     SortByQuery:
 *       in: query
 *       name: sortBy
 *       schema:
 *         type: string
 *         enum: [id, name, email, role, createdAt, updatedAt]
 *       required: false
 *       description: Field to sort by
 *     EmailSearchQuery:
 *       in: query
 *       name: email
 *       schema:
 *         type: string
 *       required: false
 *       description: Filter by email (partial match)
 *     NameSearchQuery:
 *       in: query
 *       name: name
 *       schema:
 *         type: string
 *       required: false
 *       description: Filter by name (partial match)
 *     RoleSearchQuery:
 *       in: query
 *       name: role
 *       schema:
 *         type: string
 *         enum: [Admin, Manager, Citizen, Operator]
 *       required: false
 *       description: Filter by exact role
 *     SearchQuery:
 *       in: query
 *       name: search
 *       schema:
 *         type: string
 *       required: false
 *       description: Search term for name and email fields
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get paginated list of users
 *     description: Retrieves a paginated list of users with filtering and sorting options
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *       - $ref: '#/components/parameters/SortDirectionQuery'
 *       - $ref: '#/components/parameters/SortByQuery'
 *       - $ref: '#/components/parameters/EmailSearchQuery'
 *       - $ref: '#/components/parameters/NameSearchQuery'
 *       - $ref: '#/components/parameters/RoleSearchQuery'
 *       - $ref: '#/components/parameters/SearchQuery'
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     sort:
 *                       type: object
 *                       properties:
 *                         by:
 *                           type: string
 *                           example: createdAt
 *                         direction:
 *                           type: string
 *                           example: DESC
 *       400:
 *         description: Bad request, invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching users
 */
usersRouter.get('/', getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves detailed information about a specific user
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching user
 */
usersRouter.get('/:id', getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user account. A password setup link will be sent to the user's email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully. Password setup required.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email already in use
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating user
 */
usersRouter.post('/', create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates an existing user's information
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, validation error or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Email already in use by another user
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating user
 */
usersRouter.put('/:id', update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Soft-deletes a user from the system
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting user
 */
usersRouter.delete('/:id', remove);

/**
 * @swagger
 * /users/setup-password/{token}:
 *   post:
 *     summary: Set password for a new user
 *     description: Sets the initial password for a newly created user using a token sent via email
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/TokenParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SetPasswordDto'
 *     responses:
 *       200:
 *         description: Password set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password set successfully
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error setting password
 */
usersRouter.post('/setup-password/:token', setupPassword);

export default usersRouter;