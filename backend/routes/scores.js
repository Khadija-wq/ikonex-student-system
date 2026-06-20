const express = require('express');
const router = express.Router();

// POST enter or update score
router.post('/', async (req, res) => {
    const { student_id, subject_id, exam_score, ca_score, term, academic_year } = req.body;
    
    if (exam_score < 0 || exam_score > 100 || ca_score < 0 || ca_score > 100) {
        return res.status(400).json({ success: false, error: 'Scores must be between 0 and 100' });
    }
    
    try {
        const existing = await req.db.query(
            'SELECT id FROM scores WHERE student_id = $1 AND subject_id = $2 AND term = $3 AND academic_year = $4',
            [student_id, subject_id, term, academic_year]
        );
        
        if (existing.length > 0) {
            await req.db.query(
                'UPDATE scores SET exam_score = $1, ca_score = $2 WHERE student_id = $3 AND subject_id = $4 AND term = $5 AND academic_year = $6',
                [exam_score, ca_score, student_id, subject_id, term, academic_year]
            );
            res.json({ success: true, message: 'Score updated successfully' });
        } else {
            await req.db.query(
                'INSERT INTO scores (student_id, subject_id, exam_score, ca_score, term, academic_year) VALUES ($1, $2, $3, $4, $5, $6)',
                [student_id, subject_id, exam_score, ca_score, term, academic_year]
            );
            res.status(201).json({ success: true, message: 'Score entered successfully' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET scores for a student
router.get('/student/:studentId/:term/:year', async (req, res) => {
    const { studentId, term, year } = req.params;
    try {
        const result = await req.db.query(`
            SELECT s.*, sub.name as subject_name, sub.code as subject_code,
                   (s.exam_score + s.ca_score) as total_score
            FROM scores s
            JOIN subjects sub ON s.subject_id = sub.id
            WHERE s.student_id = $1 AND s.term = $2 AND s.academic_year = $3
            ORDER BY sub.name
        `, [studentId, term, year]);
        res.json({ success: true, data: result || [] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;