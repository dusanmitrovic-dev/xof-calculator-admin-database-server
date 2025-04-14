require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false })); // Allows us to accept JSON data in body

// Define Routes
app.get('/', (req, res) => res.send('API Running')); // Simple check
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/config', require('./routes/configRoutes'));
app.use('/api/earnings', require('./routes/earningRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Mount user routes

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
