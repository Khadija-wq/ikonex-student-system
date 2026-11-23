const express = require('express');
const router = express.Router();

// GET all students with class info
router.get('/', async (req, res) => {
    try {
        const result = await req.db.query(`
            SELECT s.*, c.name as class_name, c.code as class_code 
            FROM students s
            LEFT JOIN class_streams c ON s.class_stream_id = c.id
            ORDER BY s.full_name
        `);
        
        const rows = result || [];
        
        // Return the array directly so the frontend dashboard works
        res.json(rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST new student (THIS IS THE MISSING ROUTE)
router.post('/', async (req, res) => {
    try {
        const { admission_number, full_name, class_stream_id } = req.body;
        
        const result = await req.db.query(
            `INSERT INTO students (admission_number, full_name, class_stream_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [admission_number, full_name, class_stream_id]
        );
        
        res.status(201).json({ success: true, data: result[0] });
    } catch (error) {
        console.error('Error saving student:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;