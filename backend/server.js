const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/db');

const app = express();

// Explicitly allow your Netlify frontend
app.use(cors({
    origin: 'https://ikonex-student-system.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests explicitly (this fixes the ERR_FAILED issue)
app.options('*', cors());

app.use((req, res, next) => {
    req.db = pool;
    next();
});

const classStreamsRoutes = require('./routes/classStreams');
const studentsRoutes = require('./routes/students');
const subjectsRoutes = require('./routes/subjects');
const scoresRoutes = require('./routes/scores');
const reportsRoutes = require('./routes/reports');

app.use('/api/class-streams', classStreamsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/subjects', subjectsRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Ikonex Academy API', status: 'running' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const dbConnected = await testConnection();
        if (dbConnected) {
            console.log('✅ Database connected successfully');
        } else {
            console.warn('⚠️ Database connection failed, but starting server anyway');
        }
    } catch (error) {
        console.warn('⚠️ Database connection error:', error.message);
    }

    // Start the server regardless of the DB status
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}
