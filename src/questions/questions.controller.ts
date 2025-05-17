import { Router } from 'express';
import { create, remove, getAll, getById, update } from './questions.service';

const questionsRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         blockType:
 *           $ref: '#/components/schemas/BlockType'
 *         statement:
 *           type: string
 *           example: "Why does water matter?"
 *         description:
 *           type: string
 *           example: "Explanation about water importance"
 *         resourceUrl:
 *           type: string
 *           example: "https://example.com/video1.mp4"
 *         dynamicType:
 *           $ref: '#/components/schemas/DynamicType'
 *         questionType:
 *           $ref: '#/components/schemas/QuestionType'
 *         feedback:
 *           type: string
 *           example: "Water is essential for all life forms"
 *         moduleId:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BlockType:
 *       type: string
 *       enum: [text, video, image, question]
 *       example: "video"
 *     DynamicType:
 *       type: string
 *       enum: [multiple_choice, single_answer, drag_and_drop, text_input, video_resource]
 *       example: "multiple_choice"
 *     QuestionType:
 *       type: string
 *       enum: [knowledge_check, practice, assessment, reflection]
 *       example: "knowledge_check"
 *     CreateQuestionDto:
 *       type: object
 *       required:
 *         - blockType
 *         - statement
 *         - dynamicType
 *         - questionType
 *         - feedback
 *         - moduleId
 *       properties:
 *         blockType:
 *           $ref: '#/components/schemas/BlockType'
 *         statement:
 *           type: string
 *           example: "Why does water matter?"
 *         description:
 *           type: string
 *           example: "Explanation about water importance"
 *         resourceUrl:
 *           type: string
 *           example: "https://example.com/video1.mp4"
 *         dynamicType:
 *           $ref: '#/components/schemas/DynamicType'
 *         questionType:
 *           $ref: '#/components/schemas/QuestionType'
 *         feedback:
 *           type: string
 *           example: "Water is essential for all life forms"
 *         moduleId:
 *           type: integer
 *           example: 1
 *     UpdateQuestionDto:
 *       type: object
 *       properties:
 *         blockType:
 *           $ref: '#/components/schemas/BlockType'
 *         statement:
 *           type: string
 *           example: "Updated question about water"
 *         description:
 *           type: string
 *           example: "Updated explanation"
 *         resourceUrl:
 *           type: string
 *           example: "https://example.com/video2.mp4"
 *         dynamicType:
 *           $ref: '#/components/schemas/DynamicType'
 *         questionType:
 *           $ref: '#/components/schemas/QuestionType'
 *         feedback:
 *           type: string
 *           example: "Updated feedback"
 *         moduleId:
 *           type: integer
 *           example: 1
 *   parameters:
 *     QuestionIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: The ID of the question
 */

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management endpoints
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: List all questions
 *     description: Retrieve a paginated list of questions with filtering options
 *     tags: [Questions]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/SortDirectionQuery'
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, createdAt, updatedAt]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for statement, description or feedback
 *       - in: query
 *         name: blockType
 *         schema:
 *           $ref: '#/components/schemas/BlockType'
 *       - in: query
 *         name: dynamicType
 *         schema:
 *           $ref: '#/components/schemas/DynamicType'
 *       - in: query
 *         name: questionType
 *         schema:
 *           $ref: '#/components/schemas/QuestionType'
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: integer
 *         description: Filter by module ID
 *     responses:
 *       200:
 *         description: A paginated list of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
questionsRouter.get('/', getAll);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     summary: Get a question by ID
 *     description: Retrieve detailed information about a specific question
 *     tags: [Questions]
 *     parameters:
 *       - $ref: '#/components/parameters/QuestionIdParam'
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
questionsRouter.get('/:id', getById);

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     description: Create a new question within a module
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateQuestionDto'
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error or invalid module ID
 *       404:
 *         description: Module not found
 *       500:
 *         description: Internal server error
 */
questionsRouter.post('/', create);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     summary: Update a question
 *     description: Update an existing question with the provided information
 *     tags: [Questions]
 *     parameters:
 *       - $ref: '#/components/parameters/QuestionIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuestionDto'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Question or Module not found
 *       500:
 *         description: Internal server error
 */
questionsRouter.put('/:id', update);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     description: Soft delete a question (mark as deleted without permanent removal)
 *     tags: [Questions]
 *     parameters:
 *       - $ref: '#/components/parameters/QuestionIdParam'
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Question deleted successfully"
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
questionsRouter.delete('/:id', remove);

export default questionsRouter;