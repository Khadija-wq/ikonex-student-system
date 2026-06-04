const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.query(`
            SELECT s.*, c.name as class_name 
            FROM students s
            JOIN class_streams c ON s.class_stream_id = c.id
        `);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { admission_number, full_name, class_stream_id } = req.body;
    if (!admission_number || !full_name || !class_stream_id) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }
    try {
        const [result] = await req.db.query(
            'INSERT INTO students (admission_number, full_name, class_stream_id) VALUES (?, ?, ?)',
            [admission_number, full_name, class_stream_id]
        );
        res.status(201).json({ success: true, data: { id: result.insertId, admission_number, full_name, class_stream_id } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;