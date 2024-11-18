const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./database.db', (err) => {
    if(err){
        console.error("Could not connect to database", err);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        )
    `);
});

// CRUD Operations
app.get('/items', (req, res) => {
    db.all("SELECT * FROM items", [], (err,rows) => {
        if (err) {
            res.status(500).json({error:err.message});
            return;
        }
        res.json({items: rows})
    });
});

app.post('/items', (req,res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }

    const stmt = db.prepare("INSERT INTO items (name, description) VALUES (?,?)");
    stmt.run(name, decription || null, function (err) {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.status(201).json({
            id:this.lastID,
            name,
            description,
            date_created: new Date().toISOString()
        });
    });
});

app.put('/items', (req, res) => {
    const { name, description } = req.body;
    const id = req.params.id;

    if(!name) {
        return res.status(400).json({error: 'Name is required'});
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
});

app.patch('/items:id', (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name && !description) {
        return res.status(400).json({error: 'At least one field (name or description) is required for updating the table'});
    }

    const stmt = db.prepate("UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?");
    stmt.run(name, description, id, function (err) {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Item not found' });
        } else {
            res.json({ message: 'Item partially updated successfully' });
        }
    });
});

app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    const stmt = db.prepare("DELETE FROM items WHERE id = ?");
    stmt.run(id, function (err) {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({message: 'Item not found'});
        } else {
            res.json({message: 'Item deleted succesfully'});
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});