const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const movieRoutes = require('./routes/items');
app.use('/items', movieRoutes);

// Initialize SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Could not connect to database:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

// Create 'items' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`, (err) => {
    if (err) {
        console.error("Error creating table:", err.message);
    } else {
        console.log("Items table is ready.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
