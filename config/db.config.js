// config/db.config.js
const sqlite3 = require('sqlite3').verbose();

// Create in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to in-memory SQLite database');
        initializeDatabase();
    }
});

// Initialize database with tables and sample data
function initializeDatabase() {
    // Create tables
    db.serialize(() => {
        // Create Authors table
        db.run(`CREATE TABLE Authors (
            author_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL
        )`);

        // Create Publishers table
        db.run(`CREATE TABLE Publishers (
            publisher_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )`);

        // Create Categories table
        db.run(`CREATE TABLE Categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_name TEXT NOT NULL
        )`);

        // Create Users table
        db.run(`CREATE TABLE Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL
        )`);

        // Create Books table
        db.run(`CREATE TABLE Books (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            isbn TEXT UNIQUE,
            publication_year INTEGER,
            copies_available INTEGER DEFAULT 1,
            author_id INTEGER,
            publisher_id INTEGER,
            category_id INTEGER,
            FOREIGN KEY (author_id) REFERENCES Authors (author_id),
            FOREIGN KEY (publisher_id) REFERENCES Publishers (publisher_id),
            FOREIGN KEY (category_id) REFERENCES Categories (category_id)
        )`);

        // Create Fines table
        db.run(`CREATE TABLE Fines (
            fine_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            fine_amount DECIMAL(10,2) DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES Users (user_id)
        )`);

        // Insert sample data
        insertSampleData();
    });
}

// Insert sample data
function insertSampleData() {
    // Insert Authors
    const authors = [
        ['F. Scott', 'Fitzgerald'],
        ['Harper', 'Lee'],
        ['George', 'Orwell'],
        ['J.K.', 'Rowling'],
        ['J.R.R.', 'Tolkien']
    ];

    const insertAuthor = db.prepare('INSERT INTO Authors (first_name, last_name) VALUES (?, ?)');
    authors.forEach(author => {
        insertAuthor.run(author[0], author[1]);
    });
    insertAuthor.finalize();

    // Insert Publishers
    const publishers = [
        ['Scribner'],
        ['Harper Perennial'],
        ['Signet Classic'],
        ['Scholastic'],
        ['Houghton Mifflin']
    ];

    const insertPublisher = db.prepare('INSERT INTO Publishers (name) VALUES (?)');
    publishers.forEach(publisher => {
        insertPublisher.run(publisher[0]);
    });
    insertPublisher.finalize();

    // Insert Categories
    const categories = [
        ['Fiction'],
        ['Classic Literature'],
        ['Science Fiction'],
        ['Fantasy'],
        ['Mystery']
    ];

    const insertCategory = db.prepare('INSERT INTO Categories (category_name) VALUES (?)');
    categories.forEach(category => {
        insertCategory.run(category[0]);
    });
    insertCategory.finalize();

    // Insert Users
    const users = [
        ['John', 'Doe'],
        ['Jane', 'Smith'],
        ['Bob', 'Johnson'],
        ['Alice', 'Brown']
    ];

    const insertUser = db.prepare('INSERT INTO Users (first_name, last_name) VALUES (?, ?)');
    users.forEach(user => {
        insertUser.run(user[0], user[1]);
    });
    insertUser.finalize();

    // Insert Books
    const books = [
        ['The Great Gatsby', '978-0743273565', 1925, 5, 1, 1, 1],
        ['To Kill a Mockingbird', '978-0446310789', 1960, 3, 2, 2, 1],
        ['1984', '978-0451524935', 1949, 4, 3, 3, 2],
        ['Harry Potter and the Sorcerer\'s Stone', '978-0590353427', 1997, 8, 4, 4, 4],
        ['The Hobbit', '978-0547928241', 1937, 6, 5, 5, 4]
    ];

    const insertBook = db.prepare('INSERT INTO Books (title, isbn, publication_year, copies_available, author_id, publisher_id, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    books.forEach(book => {
        insertBook.run(book[0], book[1], book[2], book[3], book[4], book[5], book[6]);
    });
    insertBook.finalize();

    // Insert Fines
    const fines = [
        [1, 15.50],
        [2, 0.00],
        [3, 25.75],
        [4, 5.25]
    ];

    const insertFine = db.prepare('INSERT INTO Fines (user_id, fine_amount) VALUES (?, ?)');
    fines.forEach(fine => {
        insertFine.run(fine[0], fine[1]);
    });
    insertFine.finalize();

    console.log('Database initialized with sample data');
}

// Promisify database operations for easier use
function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    db,
    run,
    get,
    all
};
