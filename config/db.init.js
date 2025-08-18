// config/db.init.js
const createTables = (db, callback) => {
    const tables = [
        // Users table
        `CREATE TABLE IF NOT EXISTS Users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // Authors table
        `CREATE TABLE IF NOT EXISTS Authors (
            author_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            birth_year INTEGER,
            nationality TEXT
        )`,
        
        // Publishers table
        `CREATE TABLE IF NOT EXISTS Publishers (
            publisher_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT,
            established_year INTEGER
        )`,
        
        // Categories table
        `CREATE TABLE IF NOT EXISTS Categories (
            category_id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_name TEXT NOT NULL UNIQUE
        )`,
        
        // Books table
        `CREATE TABLE IF NOT EXISTS Books (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author_id INTEGER NOT NULL,
            publisher_id INTEGER NOT NULL,
            category_id INTEGER NOT NULL,
            isbn TEXT UNIQUE,
            publication_year INTEGER,
            copies_available INTEGER DEFAULT 1,
            FOREIGN KEY (author_id) REFERENCES Authors (author_id),
            FOREIGN KEY (publisher_id) REFERENCES Publishers (publisher_id),
            FOREIGN KEY (category_id) REFERENCES Categories (category_id)
        )`,
        
        // Transactions table (loans)
        `CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            borrow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            due_date DATETIME NOT NULL,
            return_date DATETIME,
            FOREIGN KEY (book_id) REFERENCES Books (book_id),
            FOREIGN KEY (user_id) REFERENCES Users (user_id)
        )`,
        
        // Fines table
        `CREATE TABLE IF NOT EXISTS Fines (
            fine_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            transaction_id INTEGER NOT NULL,
            fine_amount DECIMAL(10,2) NOT NULL,
            fine_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_paid BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES Users (user_id),
            FOREIGN KEY (transaction_id) REFERENCES transactions (transaction_id)
        )`
    ];

    const sampleData = [
        // Insert sample users
        `INSERT INTO Users (first_name, last_name, email, phone, address) VALUES
            ('John', 'Doe', 'john.doe@email.com', '555-0101', '123 Main St'),
            ('Jane', 'Smith', 'jane.smith@email.com', '555-0102', '456 Oak Ave'),
            ('Mike', 'Johnson', 'mike.johnson@email.com', '555-0103', '789 Pine Rd'),
            ('Sarah', 'Wilson', 'sarah.wilson@email.com', '555-0104', '321 Elm St'),
            ('David', 'Brown', 'david.brown@email.com', '555-0105', '654 Maple Dr')`,
        
        // Insert sample authors
        `INSERT INTO Authors (first_name, last_name, birth_year, nationality) VALUES
            ('F. Scott', 'Fitzgerald', 1896, 'American'),
            ('George', 'Orwell', 1903, 'British'),
            ('Harper', 'Lee', 1926, 'American'),
            ('J.K.', 'Rowling', 1965, 'British'),
            ('Stephen', 'King', 1947, 'American'),
            ('Agatha', 'Christie', 1890, 'British'),
            ('Mark', 'Twain', 1835, 'American'),
            ('Jane', 'Austen', 1775, 'British')`,
        
        // Insert sample publishers
        `INSERT INTO Publishers (name, country, established_year) VALUES
            ('Penguin Random House', 'USA', 1927),
            ('HarperCollins', 'USA', 1989),
            ('Simon & Schuster', 'USA', 1924),
            ('Macmillan Publishers', 'UK', 1843),
            ('Hachette Book Group', 'France', 1826),
            ('Scholastic', 'USA', 1920)`,
        
        // Insert sample categories
        `INSERT INTO Categories (category_name) VALUES
            ('Fiction'),
            ('Mystery'),
            ('Science Fiction'),
            ('Fantasy'),
            ('Romance'),
            ('Thriller'),
            ('Biography'),
            ('History'),
            ('Science'),
            ('Classic Literature')`,
        
        // Insert sample books
        `INSERT INTO Books (title, author_id, publisher_id, category_id, isbn, publication_year, copies_available) VALUES
            ('The Great the Gatsby', 1, 1, 10, '978-0-7432-7356-5', 1925, 5),
            ('1984', 2, 2, 3, '978-0-452-28423-4', 1949, 3),
            ('To Kill Mockingbird', 3, 3, 1, '978-0-06-112008-4', 1960, 4),
            ('Harry Potter and Philosopher''s Stone', 4, 4, 4, '978-0-7475-3269-9', 1997, 6),
            ('The Shining', 5, 5, 6, '978-0-385-12167-5', 1977, 2),
            ('Murder on the Orient Express', 6, 1, 2, '978-0-00-816484-9', 1934, 3),
            ('The Adventures of Tom Sawyer', 7, 2, 10, '978-0-14-035076-9', 1876, 4),
            ('Pride and Prejudice', 8, 3, 5, '978-0-14-143951-8', 1813, 5),
            ('Animal Farm', 2, 4, 1, '978-0-452-28424-1', 1945, 3),
            ('It', 5, 5, 6, '978-0-670-81302-4', 1986, 2)`,
        
        // Insert some sample transactions (some returned, some active)
        `INSERT INTO transactions (book_id, user_id, borrow_date, due_date, return_date) VALUES
            (1, 1, '2024-01-01 10:00:00', '2024-01-15 23:59:59', '2024-01-20 14:30:00'),
            (2, 2, '2024-01-05 11:00:00', '2024-01-19 23:59:59', NULL),
            (3, 3, '2024-01-10 09:00:00', '2024-01-24 23:59:59', '2024-01-22 16:00:00'),
            (4, 1, '2024-01-15 14:00:00', '2024-01-29 23:59:59', NULL),
            (5, 4, '2024-01-20 16:00:00', '2024-02-03 23:59:59', NULL)`,
        
        // Insert some sample fines (for overdue returns)
        `INSERT INTO Fines (user_id, transaction_id, fine_amount, fine_date, is_paid) VALUES
            (1, 1, 5.00, '2024-01-20 14:30:00', 0),
            (3, 3, 0.00, '2024-01-22 16:00:00', 1)`
    ];

    let completed = 0;
    const total = tables.length + sampleData.length;

    const executeNext = (index) => {
        if (index < tables.length) {
            db.run(tables[index], (err) => {
                if (err) {
                    console.error(`Error creating table ${index + 1}:`, err.message);
                    return callback(err);
                }
                completed++;
                if (completed === total) {
                    console.log('✅ Database initialized successfully with tables and sample data!');
                    callback(null);
                } else {
                    executeNext(index + 1);
                }
            });
        } else {
            // Execute sample data insertions
            const dataIndex = index - tables.length;
            if (dataIndex < sampleData.length) {
                db.run(sampleData[dataIndex], (err) => {
                    if (err) {
                        console.error(`Error inserting sample data ${dataIndex + 1}:`, err.message);
                        return callback(err);
                    }
                    completed++;
                    if (completed === total) {
                        console.log('✅ Database initialized successfully with tables and sample data!');
                        callback(null);
                    } else {
                        executeNext(index + 1);
                    }
                });
            }
        }
    };

    console.log('🔧 Initializing in-memory database...');
    executeNext(0);
};

module.exports = { createTables };