const express = require('express');
const router = express.Router();

// GET all class streams
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM class_streams ORDER BY name');
        res.json({ success: true, data: result || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single class stream
router.get('/:id', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM class_streams WHERE id = $1', [req.params.id]);
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Class stream not found' });
        }
        res.json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create class stream
router.post('/', async (req, res) => {
    const { name, code } = req.body;
    if (!name || !code) {
        return res.status(400).json({ success: false, error: 'Name and code are required' });
    }
    try {
        const result = await req.db.query(
            'INSERT INTO class_streams (name, code) VALUES ($1, $2) RETURNING *',
            [name, code.toUpperCase()]
        );
        res.status(201).json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update class stream
router.put('/:id', async (req, res) => {
    const { name, code } = req.body;
    try {
        const result = await req.db.query(
            'UPDATE class_streams SET name = $1, code = $2 WHERE id = $3 RETURNING *',
            [name, code.toUpperCase(), req.params.id]
        );
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Class stream not found' });
        }
        res.json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE class stream
router.delete('/:id', async (req, res) => {
    try {
        const result = await req.db.query('DELETE FROM class_streams WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Class stream not found' });
        }
        res.json({ success: true, message: 'Class stream deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;