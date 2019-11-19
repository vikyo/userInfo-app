const express = require('express');

const userRoute = require('./routers/user');
const authRoute = require('./routers/auth');
const connecToDataBase = require('./config/db');

app = express();

// Connect Database
connecToDataBase();

// Initialize the middleWare for parsing the request body
app.use(express.json());

// Initialize the port
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Api is all set and running');
});

// Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

// Listen to port
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
