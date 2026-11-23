const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/db');

const app = express();

// CORS configuration
app.use(cors({
    origin: 'https://ikonex-student-system.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());

// Pass the database pool to routes
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// --- IMPORT ROUTES ---
const classStreamsRoutes = require('./routes/classStreams');
const studentsRoutes = require('./routes/students');
const subjectsRoutes = require('./routes/subjects');
const scoresRoutes = require('./routes/scores');
const reportsRoutes = require('./routes/reports');

// --- USE ROUTES ---
app.use('/api/class-streams', classStreamsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/reports', reportsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Ikonex Academy API', status: 'running' });
});

const PORT = process.env.PORT || 10000;

// 1. START THE SERVER IMMEDIATELY
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// 2. THEN check the database in the background
async function checkDB() {
    try {
        const dbConnected = await testConnection();
        if (dbConnected) {
            console.log('✅ Database connected successfully');
        } else {
            console.warn('⚠️ Database connection failed, but server is running');
        }
    } catch (error) {
        console.warn('⚠️ Database connection error:', error.message);
    }
}

checkDB();