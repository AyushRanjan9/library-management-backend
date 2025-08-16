// routes/library.routes.js
const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books in the library
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/books', libraryController.getAllBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     description: Add a new book to the library database
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author_id
 *               - publisher_id
 *               - category_id
 *               - isbn
 *               - publication_year
 *               - copies_available
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book
 *                 example: "The Great Gatsby"
 *               author_id:
 *                 type: integer
 *                 description: ID of the book author
 *                 example: 1
 *               publisher_id:
 *                 type: integer
 *                 description: ID of the book publisher
 *                 example: 1
 *               category_id:
 *                 type: integer
 *                 description: ID of the book category
 *                 example: 1
 *               isbn:
 *                 type: string
 *                 description: ISBN number of the book
 *                 example: "978-0743273565"
 *               publication_year:
 *                 type: integer
 *                 description: Year the book was published
 *                 example: 1925
 *               copies_available:
 *                 type: integer
 *                 description: Number of copies available
 *                 example: 5
 *     responses:
 *       201:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Book added successfully"
 *                 bookId:
 *                   type: integer
 *                   example: 123
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/books', libraryController.addBook);

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     summary: Get book details by ID
 *     description: Retrieve detailed information about a specific book including author, publisher, and category details
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: Unique identifier of the book
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Book details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/BookDetail'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No book found with ID 1"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/books/:bookId', libraryController.getBookById);

/**
 * @swagger
 * /fines/{userId}:
 *   get:
 *     summary: Get total fines for a user
 *     description: Retrieve the total fine amount for a specific user
 *     tags: [Fines]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: Unique identifier of the user
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: User fines retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Fine'
 *       404:
 *         description: No fines found for this user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No fines found for this user"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/fines/:userId', libraryController.getTotalFines);

module.exports = router;
