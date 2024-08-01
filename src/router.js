const express = require('express');
const db = require('./db');
const util = require('util');
const router = express.Router();
const query = util.promisify(db.query).bind(db);

// Define desired isolation level
const isolationLevel = 'READ COMMITTED';

// Search movies
router.get('/api/movies', async (req, res) => {
    try {
        const searchTerm = req.query.search;
        const searchQuery = 'SELECT * FROM movie WHERE title LIKE ? OR genre LIKE ?';
        const results = await query(searchQuery, [`%${searchTerm}%`, `%${searchTerm}%`]);
        res.json(results);
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while fetching the movies' });
    }
});

// Insert new movie
router.post('/api/movies', async (req, res) => {
    const connection = await db.beginTransaction(isolationLevel);
    try {
        const { title, director, actor, releaseDate, budget, rating, genre } = req.body;
        const insertQuery = 'INSERT INTO movie (title, director, actor, release_date, budget, rating, genre) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await connection.query(insertQuery, [title, director, actor, releaseDate, budget, rating, genre]);
        await db.commitTransaction(connection);
        res.status(201).json({ success: true });
    } catch (error) {
        await db.rollbackTransaction(connection);
        res.status(500).json({ success: false, message: 'An error occurred while inserting the movie' });
    }
});

// Update movie
router.put('/api/movies/:id', async (req, res) => {
    const connection = await db.beginTransaction(isolationLevel);
    try {
        const { id } = req.params;
        const { title, director, actor, releaseDate, budget, rating, genre } = req.body;
        const updateQuery = 'UPDATE movie SET title = ?, director = ?, actor = ?, release_date = ?, budget = ?, rating = ?, genre = ? WHERE id = ?';
        await connection.query(updateQuery, [title, director, actor, releaseDate, budget, rating, genre, id]);
        await db.commitTransaction(connection);
        res.json({ success: true });
    } catch (error) {
        await db.rollbackTransaction(connection);
        res.status(500).json({ success: false, message: 'An error occurred while updating the movie' });
    }
});

// Delete movie
router.delete('/api/movies/:id', async (req, res) => {
    const connection = await db.beginTransaction(isolationLevel);
    try {
        const { id } = req.params;
        const deleteQuery = 'DELETE FROM movie WHERE id = ?';
        await connection.query(deleteQuery, [id]);
        await db.commitTransaction(connection);
        res.json({ success: true });
    } catch (error) {
        await db.rollbackTransaction(connection);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the movie' });
    }
});

module.exports = router;
