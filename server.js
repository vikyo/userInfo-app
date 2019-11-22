const express = require('express');

const userRoute = require('./routers/user');
const authRoute = require('./routers/auth');
const saveUserDataRoute = require('./routers/userData');

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
app.use('/api/user/save', saveUserDataRoute);
app.use('/api/user', saveUserDataRoute);

// Listen to port
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
