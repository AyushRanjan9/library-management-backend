// routes/library.routes.js
const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/library.controller');


// books detail
router.get('/books/:bookId', libraryController.getBookById);


// Define routes
router.get('/books', libraryController.getAllBooks);
router.post('/books', libraryController.addBook);

// Get total fines for a specific user
router.get('/fines/:userId', libraryController.getTotalFines);


module.exports = router;
