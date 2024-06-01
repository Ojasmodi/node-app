const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;;

app.use(bodyParser.json());

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Connect to the database
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
})

app.get('/welcome', (req, res) => {
    res.status(200).send("Hello from kubernetes with new docker image.");  
});

// Create a user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.execute(query, [name, email], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ id: result.insertId, name, email });
    });
});

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) { 
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results[0]);
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    db.execute(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(`User with ID ${id} deleted.`);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
