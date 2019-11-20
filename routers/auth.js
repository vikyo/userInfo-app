const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const auth = require('../middleware/auth');
const User = require('../models/User');

//@route  GET api/auth
//@desc   Get the authenticated user info
//@access Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

//@route  POST api/auth
//@desc   Authenticate user and send token
//@access Public
router.post('/', [check('email', 'Please provide valid email').isEmail(), check('password').exists()], async (req, res) => {
    try {
        // error checking
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        // finding user by email
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        //validating password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // creating payload for jwt
        const payload = {
            user: {
                id: user.id
            }
        };

        // sending the response token back to user
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '7d' }, (err, token) => {
            if (err) throw new err();
            res.json({ token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
