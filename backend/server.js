const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const dbConnected = await testConnection();
    if (dbConnected) {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } else {
        console.error('Cannot start server without database connection');
        process.exit(1);
    }
}

startServer();