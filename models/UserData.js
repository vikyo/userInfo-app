const mongoose = require('mongoose');
const validator = require('validator');

let UserData = new mongoose.Schema({
    ownerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (validator.isEmpty(value)) {
                throw new Error('Name is required');
            }
        }
    },
    mobileNumber: {
        type: Number,
        required: true,
        trim: true,
        min: 10,
        max: 10,
        validate(value) {
            if (validator.isLength(value) !== 10) {
                throw new Error('Mobile number must be of 10 digits');
            }
        }
    }
});

module.exports = UserData = mongoose.model('userData', UserData);
