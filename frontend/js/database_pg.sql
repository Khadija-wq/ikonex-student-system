-- PostgreSQL version of your database

-- Drop tables if they exist (in correct order)
DROP TABLE IF EXISTS scores;
DROP TABLE IF EXISTS class_subjects;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS class_streams;
DROP TABLE IF EXISTS grading_scale;

-- Create class_streams table
CREATE TABLE class_streams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    admission_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    class_stream_id INTEGER NOT NULL REFERENCES class_streams(id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create class_subjects table
CREATE TABLE class_subjects (
    class_stream_id INTEGER NOT NULL REFERENCES class_streams(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (class_stream_id, subject_id)
);

-- Create scores table
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id),
    exam_score DECIMAL(5,2) CHECK (exam_score >= 0 AND exam_score <= 100),
    ca_score DECIMAL(5,2) CHECK (ca_score >= 0 AND ca_score <= 100),
    term VARCHAR(20) NOT NULL,
    academic_year VARCHAR(9) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, subject_id, term, academic_year)
);

-- Create grading_scale table
CREATE TABLE grading_scale (
    id SERIAL PRIMARY KEY,
    min_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    grade VARCHAR(2) NOT NULL,
    remark VARCHAR(20) NOT NULL
);

-- Insert grading scale
INSERT INTO grading_scale (min_score, max_score, grade, remark) VALUES
(80, 100, 'A', 'Excellent'),
(70, 79, 'B', 'Very Good'),
(60, 69, 'C', 'Good'),
(50, 59, 'D', 'Pass'),
(0, 49, 'E', 'Needs Improvement');

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

-- Insert sample students
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