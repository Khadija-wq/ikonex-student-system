-- Create Tables for PostgreSQL

CREATE TABLE class_streams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    admission_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    class_stream_id INT REFERENCES class_streams(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE class_subjects (
    class_stream_id INT REFERENCES class_streams(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (class_stream_id, subject_id)
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    exam_term VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grading_scale (
    id SERIAL PRIMARY KEY,
    min_score INT NOT NULL,
    max_score INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    remarks VARCHAR(50) NOT NULL
);

-- Insert Initial Data

INSERT INTO grading_scale (min_score, max_score, grade, remarks) VALUES
(80, 100, 'A', 'Excellent'),
(70, 79, 'B', 'Very Good'),
(60, 69, 'C', 'Good'),
(50, 59, 'D', 'Pass'),
(0, 49, 'E', 'Fail');

INSERT INTO class_streams (name, code) VALUES
('Form 1', 'F1'),
('Form 2', 'F2'),
('Form 3', 'F3'),
('Form 4', 'F4');

INSERT INTO subjects (name, code) VALUES
('Mathematics', 'MAT'),
('English', 'ENG'),
('Kiswahili', 'KIS'),
('Biology', 'BIO'),
('Chemistry', 'CHE'),
('Physics', 'PHY');