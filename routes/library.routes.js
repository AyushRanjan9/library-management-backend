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

/**
 * @swagger
 * /issue:
 *   post:
 *     summary: Issue a book
 *     description: Issue a book to a user (creates loan record and updates availability)
 *     tags: [Issuing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *               - user_id
 *             properties:
 *               book_id:
 *                 type: integer
 *                 description: ID of the book to issue
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 description: ID of the user to issue the book to
 *                 example: 1
 *     responses:
 *       201:
 *         description: Book issued successfully
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
 *                   example: "Book issued successfully"
 *                 book_title:
 *                   type: string
 *                   example: "The Great Gatsby"
 *                 due_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-02-15T10:00:00Z"
 *                 copies_remaining:
 *                   type: integer
 *                   example: 4
 *       400:
 *         description: Book not available or missing parameters
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
 *                   example: "Book is not available for issue."
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
 *                   example: "Book not found."
 */
router.post('/issue', libraryController.issueBook);

/**
 * @swagger
 * /return:
 *   post:
 *     summary: Return a book
 *     description: Return a book and calculate overdue fines (fetches due date from database)
 *     tags: [Returns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - book_id
 *               - user_id
 *             properties:
 *               book_id:
 *                 type: integer
 *                 description: ID of the book being returned
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 description: ID of the user returning the book
 *                 example: 1
 *               return_date:
 *                 type: string
 *                 format: date-time
 *                 description: Optional return date (defaults to current date)
 *                 example: "2024-12-25T10:00:00Z"
 *     responses:
 *       200:
 *         description: Book returned successfully
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
 *                   example: "Book returned successfully"
 *                 book_title:
 *                   type: string
 *                   example: "The Great Gatsby"
 *                 user_name:
 *                   type: string
 *                   example: "John Doe"
 *                 due_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-31T23:59:59Z"
 *                 return_date:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-25T10:00:00Z"
 *                 overdue_days:
 *                   type: integer
 *                   example: 5
 *                 fine_amount:
 *                   type: number
 *                   example: 5.00
 *       404:
 *         description: No active loan found
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
 *                   example: "No active loan found for this book and user."
 */
router.post('/return', libraryController.returnBook);

module.exports = router;
