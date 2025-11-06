require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const userRoutes = require('./routes/userRoutes')
const performanceRoutes = require('./routes/performanceRoutes')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const MONGO_URL = process.env.MONGO_URL_LOCAL; // Get the URL from .env

if (!MONGO_URL) {
    console.error('FATAL ERROR: MONGO_URL_LOCAL is not defined in .env file.');
    process.exit(1); // Stop the app if the DB string is missing
}

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('MongoDB Connected successfully!');

        // --- Start Server (Only after DB connection is successful) ---
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    })
    .catch((err) => {
        console.error('MongoDB Connection FAILED: ', err.message);
        process.exit(1);
    });


app.get('/', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.use('/api/users', userRoutes)
app.use('/api/performance', performanceRoutes)
