const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectToDataBase = async () => {
    try {
        //returns a promise so await
        await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log('Error:', err.message);
        //Exit process with Failure
        process.exit(1);
    }
};

module.exports = connectToDataBase;
