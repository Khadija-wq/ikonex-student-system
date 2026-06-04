const express = require('express');
const router = express.Router();

// Helper function to calculate grade
function calculateGrade(score) {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
}

// GET class ranking
router.get('/class-ranking/:classId/:term/:year', async (req, res) => {
    const { classId, term, year } = req.params;
    
    try {
        // Get all students in the class with their scores
        const [students] = await req.db.query(`
            SELECT 
                s.id,
                s.full_name,
                s.admission_number,
                COALESCE(SUM(sc.exam_score + sc.ca_score), 0) as total_marks,
                COALESCE(AVG(sc.exam_score + sc.ca_score), 0) as average_score,
                COUNT(DISTINCT sc.subject_id) as subjects_taken
            FROM students s
            LEFT JOIN scores sc ON s.id = sc.student_id 
                AND sc.term = ? AND sc.academic_year = ?
            WHERE s.class_stream_id = ?
            GROUP BY s.id, s.full_name, s.admission_number
            ORDER BY total_marks DESC
        `, [term, year, classId]);
        
        // Add positions and grades
        const rankedStudents = students.map((student, index) => ({
            id: student.id,
            full_name: student.full_name,
            admission_number: student.admission_number,
            total_marks: parseFloat(student.total_marks) || 0,
            average_score: parseFloat(student.average_score) || 0,
            position: index + 1,
            grade: calculateGrade(student.average_score),
            subjects_taken: student.subjects_taken || 0
        }));
        
        res.json({ success: true, data: rankedStudents });
        
    } catch (error) {
        console.error('Ranking error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;