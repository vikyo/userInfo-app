const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mobileNumber: {
        type: Number,
        required: true,
        trim: true,
        unique: true
    }
});

module.exports = UserData = mongoose.model('userData', UserDataSchema);
