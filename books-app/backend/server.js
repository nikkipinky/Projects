const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'books_db',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL');
});

// API endpoint to fetch books
app.get('/api/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// API endpoint to add a book
app.post('/api/books', (req, res) => {
    const { title, authors, publisher, published_date, description, thumbnail_url, price } = req.body;
    const query = 'INSERT INTO books (title, authors, publisher, published_date, description, thumbnail_url, price) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(
        query,
        [title, authors, publisher, published_date, description, thumbnail_url, price],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ message: 'Book added', id: results.insertId });
        }
    );
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
