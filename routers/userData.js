const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const UserData = require('../models/UserData');
const auth = require('../middleware/auth');

//@route  POST api/user/save
//@desc   Auhtenticated user saves/creates or updates data
//@access Private
router.post(
    '/',
    [
        auth,
        [
            check('name', 'Name is required')
                .not()
                .isEmpty(),
            check('userMobileNumber', 'Mobile number is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, userMobileNumber } = req.body;
        const completeDataObject = { ownerId: req.user.id, userData: [{ name, userMobileNumber }] };
        // console.log(completeDataObject);

        try {
            let userDataItem = await UserData.findOne({ ownerId: req.user.id });

            // If the owner already entered some data, then push into the existing userData array
            if (userDataItem && userDataItem.userData.length !== 0) {
                userDataItem.userData.unshift({ name, userMobileNumber });

                await userDataItem.save();
                return res.json(userDataItem);
            }

            // If owner is entering user data for first time
            userDataItem = new UserData(completeDataObject);

            await userDataItem.save();
            res.json(userDataItem);
        } catch (err) {
            console.log('Error:--', err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
