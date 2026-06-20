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
        
        // PostgreSQL returns { rows: [...] }
        const rows = result.rows || [];
        
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET students by class stream
router.get('/class/:classId', async (req, res) => {
    try {
        const result = await req.db.query(
            `SELECT s.*, c.name as class_name 
             FROM students s
             JOIN class_streams c ON s.class_stream_id = c.id
             WHERE s.class_stream_id = $1 
             ORDER BY s.full_name`,
            [req.params.classId]
        );
        
        const rows = result.rows || [];
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET single student
router.get('/:id', async (req, res) => {
    try {
        const result = await req.db.query(
            `SELECT s.*, c.name as class_name, c.code as class_code 
             FROM students s
             JOIN class_streams c ON s.class_stream_id = c.id
             WHERE s.id = $1`,
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST register new student
router.post('/', async (req, res) => {
    const { admission_number, full_name, class_stream_id } = req.body;
    
    if (!admission_number || !full_name || !class_stream_id) {
        return res.status(400).json({ 
            success: false, 
            error: 'Admission number, full name, and class stream are required' 
        });
    }
    
    try {
        const result = await req.db.query(
            'INSERT INTO students (admission_number, full_name, class_stream_id) VALUES ($1, $2, $3) RETURNING *',
            [admission_number, full_name, class_stream_id]
        );
        
        res.status(201).json({ 
            success: true, 
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    const { full_name, class_stream_id } = req.body;
    
    try {
        const result = await req.db.query(
            'UPDATE students SET full_name = $1, class_stream_id = $2 WHERE id = $3 RETURNING *',
            [full_name, class_stream_id, req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        const result = await req.db.query(
            'DELETE FROM students WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;