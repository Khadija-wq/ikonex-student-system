const express = require('express');
const router = express.Router();

// GET all students with class info
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query(`
            SELECT s.*, c.name as class_name, c.code as class_code 
            FROM students s
            JOIN class_streams c ON s.class_stream_id = c.id
            ORDER BY s.full_name
        `);
        
        // result is already the rows array from our db.js override
        const rows = result || [];
        
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;