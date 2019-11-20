const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// const config = require('config');
// const jwt = require('jsonwebtoken');

const UserData = require('../models/UserData');
const auth = require('../middleware/auth');

//@route  POST api/user/:user_id/save
//@desc   Auhtenticated user saves/creates or updates data
//@access Private
router.post(
    '/',
    [
        auth,
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('mobileNumber', 'MObile number is required')
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, mobileNumber } = req.body;
        const dataObject = {};
        dataObject.ownerName = req.user.id; // req.user.id is from JWT token payload

        if (name) dataObject.name = name;
        if (mobileNumber) dataObject.mobileNumber = mobileNumber;

        try {
            let userData = await UserData.findOne({ ownerName: req.user.id });

            // If the data is already present , then update the saved data
            if (userData) {
                userData = await UserData.findOneAndUpdate({ ownerName: req.user.id }, { $set: userData }, { new: true });

                return res.json(userData);
            }

            userData = new UserData(userData);

            await userData.save();
            res.json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
