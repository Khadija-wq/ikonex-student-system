-- =============================================
-- IKONEX ACADEMY STUDENT MANAGEMENT SYSTEM
-- Database Schema
-- =============================================

-- Create database (run this first)
CREATE DATABASE IF NOT EXISTS ikonex_academy;
USE ikonex_academy;

-- =============================================
-- TABLE: class_streams
-- Stores class information (Form 1A, Form 1B, etc.)
-- =============================================
CREATE TABLE IF NOT EXISTS class_streams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: students
-- Stores student personal information
-- =============================================
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admission_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    class_stream_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_stream_id) REFERENCES class_streams(id) ON DELETE RESTRICT
);

-- =============================================
-- TABLE: subjects
-- Stores subject information
-- =============================================
CREATE TABLE IF NOT EXISTS subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLE: class_subjects
-- Links subjects to class streams (which subject taught in which class)
-- =============================================
CREATE TABLE IF NOT EXISTS class_subjects (
    class_stream_id INT NOT NULL,
    subject_id INT NOT NULL,
    PRIMARY KEY (class_stream_id, subject_id),
    FOREIGN KEY (class_stream_id) REFERENCES class_streams(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- =============================================
-- TABLE: scores
-- Stores exam and continuous assessment scores
-- UNIQUE constraint prevents duplicate score entries
-- =============================================
CREATE TABLE IF NOT EXISTS scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam_score DECIMAL(5,2) CHECK (exam_score >= 0 AND exam_score <= 100),
    ca_score DECIMAL(5,2) CHECK (ca_score >= 0 AND ca_score <= 100),
    term VARCHAR(20) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_score (student_id, subject_id, term, academic_year),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

-- =============================================
-- TABLE: grading_scale
-- Configurable grading scale for result calculation
-- =============================================
CREATE TABLE IF NOT EXISTS grading_scale (
    id INT PRIMARY KEY AUTO_INCREMENT,
    min_score INT NOT NULL,
    max_score INT NOT NULL,
    grade VARCHAR(2) NOT NULL,
    remark VARCHAR(20) NOT NULL
);

-- =============================================
-- INSERT DEFAULT DATA
-- Sample data to get started
-- =============================================

-- Insert grading scale
INSERT INTO grading_scale (min_score, max_score, grade, remark) VALUES
(80, 100, 'A', 'Excellent'),
(70, 79, 'B', 'Very Good'),
(60, 69, 'C', 'Good'),
(50, 59, 'D', 'Pass'),
(0, 49, 'E', 'Fail');

-- Insert sample class streams
INSERT INTO class_streams (name, code) VALUES
('Form 1A', 'F1A'),
('Form 1B', 'F1B'),
('Form 2A', 'F2A'),
('Form 2B', 'F2B'),
('Form 3A', 'F3A');

-- Insert sample subjects
INSERT INTO subjects (name, code) VALUES
('Mathematics', 'MATH'),
('English Language', 'ENG'),
('Kiswahili', 'KISW'),
('Science', 'SCI'),
('Social Studies', 'SST'),
('Agriculture', 'AGR'),
('Business Studies', 'BST'),
('Computer Studies', 'CMP');

-- Insert sample students (5 students)
INSERT INTO students (admission_number, full_name, class_stream_id) VALUES
('2024001', 'John Doe', 1),
('2024002', 'Jane Smith', 1),
('2024003', 'Peter Jones', 1),
('2024004', 'Mary Johnson', 2),
('2024005', 'James Brown', 2);

-- Assign subjects to Form 1A (class_stream_id = 1)
INSERT INTO class_subjects (class_stream_id, subject_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- Assign subjects to Form 1B (class_stream_id = 2)
INSERT INTO class_subjects (class_stream_id, subject_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5);

-- Assign subjects to Form 2A (class_stream_id = 3)
INSERT INTO class_subjects (class_stream_id, subject_id) VALUES
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7);

-- Insert sample scores for John Doe (student_id = 1)
INSERT INTO scores (student_id, subject_id, exam_score, ca_score, term, academic_year) VALUES
(1, 1, 85, 12, 'Term 1', '2025-2026'),
(1, 2, 78, 15, 'Term 1', '2025-2026'),
(1, 3, 92, 8, 'Term 1', '2025-2026'),
(1, 4, 68, 18, 'Term 1', '2025-2026'),
(1, 5, 74, 16, 'Term 1', '2025-2026');

-- Insert sample scores for Jane Smith (student_id = 2)
INSERT INTO scores (student_id, subject_id, exam_score, ca_score, term, academic_year) VALUES
(2, 1, 72, 14, 'Term 1', '2025-2026'),
(2, 2, 88, 10, 'Term 1', '2025-2026'),
(2, 3, 65, 12, 'Term 1', '2025-2026'),
(2, 4, 91, 9, 'Term 1', '2025-2026'),
(2, 5, 58, 11, 'Term 1', '2025-2026');

-- Insert sample scores for Peter Jones (student_id = 3)
INSERT INTO scores (student_id, subject_id, exam_score, ca_score, term, academic_year) VALUES
(3, 1, 45, 10, 'Term 1', '2025-2026'),
(3, 2, 52, 8, 'Term 1', '2025-2026'),
(3, 3, 48, 12, 'Term 1', '2025-2026'),
(3, 4, 38, 7, 'Term 1', '2025-2026'),
(3, 5, 42, 9, 'Term 1', '2025-2026');

-- =============================================
-- HELPER QUERIES (for testing)
-- =============================================

-- View all students with their class names
-- SELECT s.*, c.name as class_name FROM students s JOIN class_streams c ON s.class_stream_id = c.id;

-- View all subjects assigned to Form 1A
-- SELECT s.* FROM subjects s JOIN class_subjects cs ON s.id = cs.subject_id WHERE cs.class_stream_id = 1;

-- View student performance summary
-- SELECT s.full_name, SUM(sc.exam_score + sc.ca_score) as total, AVG(sc.exam_score + sc.ca_score) as average
-- FROM students s JOIN scores sc ON s.id = sc.student_id
-- WHERE sc.term = 'Term 1' AND sc.academic_year = '2025-2026'
-- GROUP BY s.id ORDER BY total DESC;