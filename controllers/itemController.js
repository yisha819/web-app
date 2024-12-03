const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Get all items
exports.getItems = (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ items: rows });
    });
};

// Add a new item
exports.addItem = (req, res) => {
    const { name, description } = req.body;

    // Ensure 'name' is provided in the request body
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    // Prepare the SQL insert statement
    const stmt = db.prepare("INSERT INTO items (name, description) VALUES (?, ?)");

    // Run the insert statement
    stmt.run(name, description || null, function (err) {
        if (err) {
            console.error("Error inserting item:", err.message); // Log the error
            res.status(500).json({ error: err.message });
            return;
        }

        // Respond with the newly created item
        res.status(201).json({
            id: this.lastID, // Get the ID of the newly inserted item
            name,
            description,
            date_created: new Date().toISOString(), // Send the creation date as an ISO string
        });
    });
};

// Update an existing item
exports.updateItem = (req, res) => {
    const { name, description } = req.body;
    const id = req.params.id;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const stmt = db.prepare("UPDATE items SET name = ?, description = ? WHERE id = ?");
    stmt.run(name, description || null, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.json({ message: 'Item updated successfully' });
        }
    });
};

// Partially update an existing item
exports.patchItem = (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    if (name === undefined && description === undefined) {
        return res.status(400).json({ error: 'At least one field (name or description) is required for updating the table' });
    }

    const stmt = db.prepare("UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?");
    stmt.run(name, description, id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.json({ message: 'Item partially updated successfully' });
        }
    });
};

// Delete an item by ID
exports.deleteItem = (req, res) => {
    const id = req.params.id;
    const stmt = db.prepare("DELETE FROM items WHERE id = ?");
    stmt.run(id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.json({ message: 'Item deleted successfully' });
        }
    });
};
