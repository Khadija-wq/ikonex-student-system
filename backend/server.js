const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./config/db');

const app = express();

app.use(cors({
    origin: 'https://ikonex-student-system.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.options('*', cors());

app.use((req, res, next) => {
    req.db = pool;
    next();
});

// ... your routes here ...

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