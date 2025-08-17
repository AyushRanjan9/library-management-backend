// config/db.config.js
const sqlite3 = require('sqlite3').verbose();

// Create in-memory SQLite database
const connection = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error creating in-memory database:', err.message);
    } else {
        console.log('Connected to in-memory SQLite database.');
    }
});

// Convert SQLite to use promise-based interface similar to MySQL
const db = {
    query: function(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        if (sql.trim().toLowerCase().startsWith('select')) {
            connection.all(sql, params, callback);
        } else if (sql.trim().toLowerCase().startsWith('insert')) {
            connection.run(sql, params, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, { insertId: this.lastID, affectedRows: this.changes });
                }
            });
        } else {
            connection.run(sql, params, function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, { affectedRows: this.changes });
                }
            });
        }
    },
    
    // Initialize database with tables and sample data
    initialize: function(callback) {
        const initScript = require('./db.init');
        initScript.createTables(connection, callback);
    }
};

module.exports = db;