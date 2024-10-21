
// controllers/library.controller.js
const db = require('../config/db.config');

// Get details of a book by book_id
exports.getBookById = (req, res) => {
    const bookId = req.params.bookId;

    // SQL query to retrieve the book details
    const query = `
        SELECT b.title, b.isbn, b.publication_year, b.copies_available, 
               a.first_name AS author_first_name, a.last_name AS author_last_name, 
               p.name AS publisher_name, c.category_name
        FROM Books b
        JOIN Authors a ON b.author_id = a.author_id
        JOIN Publishers p ON b.publisher_id = p.publisher_id
        JOIN Categories c ON b.category_id = c.category_id
        WHERE b.book_id = ?;
    `;

    // Execute the query
    db.query(query, [bookId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'DB_QUERY_ERROR',
                    message: 'Failed to retrieve book details.',
                    details: err.message,
                }
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No book found with ID ${bookId}`,
            });
        }

        // Send the book details as response
        res.json({
            success: true,
            data: results[0] // The first result contains the book details
        });
    });
};


// Get total fines for a specific user
exports.getTotalFines = (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT u.first_name, u.last_name, SUM(f.fine_amount) AS total_fines
        FROM Fines f
        JOIN Users u ON f.user_id = u.user_id
        WHERE f.user_id = ?
        GROUP BY u.user_id;
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'DB_QUERY_ERROR',
                    message: 'Failed to retrieve total fines.',
                    details: err.message,
                }
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No fines found for this user.',
            });
        }

        res.json({
            success: true,
            data: results[0] // Return the first result, which contains the user's fine details
        });
    });
};

// Get all books
exports.getAllBooks = (req, res) => {
    db.query('SELECT * FROM Books', (err, results) => {
        if (err) {
            // Customize the error response format
            return res.status(500).json({
                success: false,
                error: {
                    code: 'DB_QUERY_ERROR',
                    message: 'An error occurred while retrieving books.',
                    details: 'something went wrong' // This can include the error message from the database
                }
            });
        }
        res.json({
            success: true,
            data: results
        });
    });
};

// Add a new book
exports.addBook = (req, res) => {
    const { title, author_id, publisher_id, category_id, isbn, publication_year, copies_available } = req.body;
    db.query('INSERT INTO Books SET ?', { title, author_id, publisher_id, category_id, isbn, publication_year, copies_available }, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: {
                    code: 'DB_INSERT_ERROR',
                    message: 'An error occurred while adding the book.',
                    details: err.message
                }
            });
        }
        res.status(201).json({
            success: true,
            message: 'Book added successfully',
            bookId: results.insertId
        });
    });
};