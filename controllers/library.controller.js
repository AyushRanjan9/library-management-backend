// controllers/library.controller.js
const db = require('../config/db.config');

// Get details of a book by book_id
exports.getBookById = (req, res) => {
    const bookId = req.params.bookId;

    // SQL query to retrieve the book details
    const query = `
        SELECT  b.book_id, b.title, b.isbn, b.publication_year, b.copies_available, 
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
        SELECT SUM(f.fine_amount) AS total_fines
        FROM Fines f
        
        WHERE f.user_id = ?
        GROUP BY f.user_id;
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
            return res.json({
                success: true,
                data: {total_fines:0}
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

// Return a book
exports.returnBook = (req, res) => {
    const { book_id, user_id, return_date } = req.body;

    if (!book_id || !user_id) {
        return res.status(400).json({
            success: false,
            message: 'Book ID and User ID are required.'
        });
    }

    // Use provided return date or current date
    const actualReturnDate = return_date ? new Date(return_date) : new Date();

    // First, fetch the due date from the database
    const getDueDateQuery = `
        SELECT l.due_date, l.transaction_id
        FROM transactions l
    
        WHERE l.book_id = ? AND l.user_id = ? 
        ORDER BY l.borrow_date DESC
        LIMIT 1;
    `;

    db.query(getDueDateQuery, [book_id, user_id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch loan information.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active loan found for this book and user.'
            });
        }

        const loan = results[0];
        const dueDate = new Date(loan.due_date);
        const overdueDays = Math.max(0, Math.floor((actualReturnDate - dueDate) / (1000 * 60 * 60 * 24)));
        const fineAmount = overdueDays * 1.00;
        console.log('actualReturnDate ' + actualReturnDate);
        console.log('dueDate ' + dueDate);
        console.log('overdueDays ' + overdueDays);

        // Update book availability (increment copies)
        db.query('UPDATE Books SET copies_available = copies_available + 1 WHERE book_id = ?', [book_id], (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to update book availability.'
                });
            }

            // Update loan status to returned with provided return date
            db.query('UPDATE transactions SET return_date = ? WHERE book_id = ? AND user_id = ? ', [actualReturnDate, book_id, user_id], (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update loan status.'
                    });
                }

                // If there are overdue days, insert into fines table
                console.log('overdueDays' + overdueDays);
                if (overdueDays > 0) {
                    db.query('INSERT INTO Fines (user_id, transaction_id, fine_amount, fine_date, is_paid) VALUES (?, ?, ?, ?, 0)', [user_id, loan.transaction_id, fineAmount, actualReturnDate], (err) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Failed to create fine record.'
                            });
                        }


                        res.json({
                            success: true,
                            message: 'Book returned successfully',
                            book_title: loan.title,
                            user_name: `${loan.first_name} ${loan.last_name}`,
                            due_date: loan.due_date,
                            return_date: actualReturnDate,
                            overdue_days: overdueDays,
                            fine_amount: fineAmount
                        });
                    });
                } else {
                    res.json({
                        success: true,
                        message: 'Book returned successfully',
                        book_title: loan.title,
                        user_name: `${loan.first_name} ${loan.last_name}`,
                        due_date: loan.due_date,
                        return_date: actualReturnDate,
                        overdue_days: overdueDays,
                        fine_amount: fineAmount
                    });
                }
            });
        });
    });
};

// Issue a book
exports.issueBook = (req, res) => {
    const { book_id, user_id } = req.body;

    if (!book_id || !user_id) {
        return res.status(400).json({
            success: false,
            message: 'Book ID and User ID are required.'
        });
    }

    // Check if book is available
    db.query('SELECT title, copies_available FROM Books WHERE book_id = ?', [book_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Failed to check book availability.'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Book not found.'
            });
        }

        const book = results[0];
        if (book.copies_available <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Book is not available for issue.'
            });
        }

        // Calculate due date (14 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        // Create loan record
        db.query('INSERT INTO transactions (book_id, user_id, borrow_date, due_date) VALUES (?, ?, CURRENT_TIMESTAMP, ? )', [book_id, user_id, dueDate], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create loan record.'

                });
            }

            // Update book availability (decrement copies)
            db.query('UPDATE Books SET copies_available = copies_available - 1 WHERE book_id = ?', [book_id], (err) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to update book availability.'
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Book issued successfully',
                    book_title: book.title,
                    due_date: dueDate,
                    copies_remaining: book.copies_available - 1
                });
            });
        });
    });
};