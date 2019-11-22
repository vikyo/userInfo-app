const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const UserData = require('../models/UserData');
const auth = require('../middleware/auth');

//@route  POST api/user/save
//@desc   Auhtenticated user saves/creates data
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

//@route  GET api/user/save
//@desc   Auhtenticated user reads the data
//@access Private
router.get('/', auth, async (req, res) => {
    try {
        const userDataItem = await UserData.findOne({ ownerId: req.user.id });

        if (!userDataItem) return res.status(404).send('User not found');

        const userdata = userDataItem.userData;
        res.json({ userdata });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route  PUT api/user/save/:userdata_id
//@desc   Auhtenticated user updates the specific data
//@access Private
router.put('/:data_id', auth, async (req, res) => {
    // console.log(dataToUpdateObject);

    try {
        const userDataItem = await UserData.findOne({ ownerId: req.user.id });
        // console.log(userDataItem);
        if (!userDataItem) return res.status(404).send('User not found');

        let userdataToUpdate = userDataItem.userData.find(data => data.id === req.params.data_id);

        if (!userdataToUpdate) return res.status(400).send('Unable to update');

        userdataToUpdate.id = req.params.data_id;
        if (req.body.name) userdataToUpdate.name = req.body.name;
        if (req.body.userMobileNumber) userdataToUpdate.userMobileNumber = req.body.userMobileNumber;
        // console.log(userdataToUpdate);
        await userDataItem.save();
        res.json({ userDataItem });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

//@route  DELETE api/user/delete
//@desc   Auhtenticated user deletes the user data
//@access Private
router.delete('/delete/all', auth, async (req, res) => {
    // console.log(dataToUpdateObject);

    try {
        const userDataItem = await UserData.findOne({ ownerId: req.user.id });
        // console.log(userDataItem);
        if (!userDataItem) return res.status(404).send('User not found');

        userDataItem.userData.splice(0);
        await userDataItem.save();
        res.json({ userDataItem });
    } catch (err) {
        // console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
