
// controllers/library.controller.js
const { run, get, all } = require('../config/db.config');

// Get details of a book by book_id
exports.getBookById = async (req, res) => {
    try {
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
        const result = await get(query, [bookId]);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: `No book found with ID ${bookId}`,
            });
        }

        // Send the book details as response
        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'DB_QUERY_ERROR',
                message: 'Failed to retrieve book details.',
                details: err.message,
            }
        });
    }
};

// Get total fines for a specific user
exports.getTotalFines = async (req, res) => {
    try {
        const userId = req.params.userId;

        const query = `
            SELECT u.first_name, u.last_name, SUM(f.fine_amount) AS total_fines
            FROM Fines f
            JOIN Users u ON f.user_id = u.user_id
            WHERE f.user_id = ?
            GROUP BY u.user_id;
        `;

        const result = await get(query, [userId]);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'No fines found for this user.',
            });
        }

        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'DB_QUERY_ERROR',
                message: 'Failed to retrieve total fines.',
                details: err.message,
            }
        });
    }
};

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const results = await all('SELECT * FROM Books');
        
        res.json({
            success: true,
            data: results
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'DB_QUERY_ERROR',
                message: 'An error occurred while retrieving books.',
                details: err.message
            }
        });
    }
};

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const { title, author_id, publisher_id, category_id, isbn, publication_year, copies_available } = req.body;
        
        const result = await run(
            'INSERT INTO Books (title, author_id, publisher_id, category_id, isbn, publication_year, copies_available) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, author_id, publisher_id, category_id, isbn, publication_year, copies_available]
        );

        res.status(201).json({
            success: true,
            message: 'Book added successfully',
            bookId: result.id
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: {
                code: 'DB_INSERT_ERROR',
                message: 'An error occurred while adding the book.',
                details: err.message
            }
        });
    }
};