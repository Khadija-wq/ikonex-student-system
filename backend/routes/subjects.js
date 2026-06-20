const express = require('express');
const router = express.Router();

// GET all subjects
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query('SELECT * FROM subjects ORDER BY name');
        res.json({ success: true, data: result || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET subjects by class
router.get('/class/:classId', async (req, res) => {
    try {
        const result = await req.db.query(`
            SELECT s.* 
            FROM subjects s
            JOIN class_subjects cs ON s.id = cs.subject_id
            WHERE cs.class_stream_id = $1
            ORDER BY s.name
        `, [req.params.classId]);
        res.json({ success: true, data: result || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create subject
router.post('/', async (req, res) => {
    const { name, code } = req.body;
    if (!name || !code) {
        return res.status(400).json({ success: false, error: 'Name and code are required' });
    }
    try {
        const result = await req.db.query(
            'INSERT INTO subjects (name, code) VALUES ($1, $2) RETURNING *',
            [name, code.toUpperCase()]
        );
        res.status(201).json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update subject
router.put('/:id', async (req, res) => {
    const { name, code } = req.body;
    try {
        const result = await req.db.query(
            'UPDATE subjects SET name = $1, code = $2 WHERE id = $3 RETURNING *',
            [name, code.toUpperCase(), req.params.id]
        );
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Subject not found' });
        }
        res.json({ success: true, data: result[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE subject
router.delete('/:id', async (req, res) => {
    try {
        const result = await req.db.query('DELETE FROM subjects WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Subject not found' });
        }
        res.json({ success: true, message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST assign subject to class
router.post('/assign-to-class', async (req, res) => {
    const { class_stream_id, subject_id } = req.body;
    try {
        await req.db.query(
            'INSERT INTO class_subjects (class_stream_id, subject_id) VALUES ($1, $2)',
            [class_stream_id, subject_id]
        );
        res.json({ success: true, message: 'Subject assigned to class successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;