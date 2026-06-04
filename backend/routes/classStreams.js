const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.query('SELECT * FROM class_streams ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { name, code } = req.body;
    if (!name || !code) {
        return res.status(400).json({ success: false, error: 'Name and code are required' });
    }
    try {
        const [result] = await req.db.query('INSERT INTO class_streams (name, code) VALUES (?, ?)', [name, code.toUpperCase()]);
        res.status(201).json({ success: true, data: { id: result.insertId, name, code: code.toUpperCase() } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;