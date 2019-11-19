const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

//@route  POST api/users
//@desc   Register an user
//@access PUBLIC
router.post(
    '/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        // username must be an email
        check('email').isEmail(),
        // password must be at least 5 chars long
        check('password').isLength({ min: 6 }),
        // mobile number length must be 10
        check('mobileNumber')
            .isLength({ min: 10, max: 10 })
            .exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password, mobileNumber } = req.body;
        try {
            let user = await User.findOne({ email });
            console.log(user);
            if (user) return res.status(400).json({ msg: 'User already registered' });

            user = new User({ name, email, password, mobileNumber });

            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            // Return the jsonwebtoken
            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(payload, config.get('jstSecret'), { expiresIn: '7 days' }, (err, token) => {
                if (err) throw err;
                res.json(token);
            });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ msg: err.message });
        }
    }
);

module.exports = router;
