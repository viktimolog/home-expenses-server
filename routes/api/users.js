const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Users works"
}));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
//POSTMAN OK
//email test1@test.net
//password test1@test.net
//password2 test1@test.net
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'Email already exists';
            // return res.status(400).json(errors);
            return res.json({
                success: false,
                message: 'Email already exists'
            });
        }

        else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
            });

            const newUser = new User({
                verifyKey: String(Date.now()),
                validation: false,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err =>
                            res.json({
                                success: false,
                                message: err
                            })
                        )

                    const path = `http://localhost:3000/emailverification/${newUser.email}/${newUser.verifyKey}`

                    console.log(path)

                    return res.json({
                        success: true,
                        message: 'Congratulation! Successful registration. Please, read the letter from us'
                    });
                });
            });

        }//else end .catch(err => console.log(err));
    })
        .catch(err =>
            res.json({
            success: false,
            message: err
            })
        )
});

// @route   GET api/users/verify
// @desc    Verify User / Returning JWT Token
// @access  Public
router.post('/verify', (req, res) => {

    // console.log('it is post(/verify')//ok

    console.log('req.body.email = ',req.body.email)
    console.log('req.body.verifyKey = ',req.body.verifyKey)

    const email = req.body.email;
    const verifyKey = req.body.verifyKey;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check for user
        if (!user) {
            errors.email = 'User not found';
            console.log('User not found')
            return res.status(404).json(errors);
        }

        if(verifyKey === user.verifyKey) {

            console.log('User has found!!!')

            user.validation = true;
            user.save()

            console.log('user after save = ',user)

            const payload = {
                id: user.id,
                email: email,
                avatar: user.avatar
            }; // Create JWT Payload

            // Sign Token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {expiresIn: 3600},
                (err, token) => {
                    res.json({
                        success: true,
                        token: token,
                        payload: payload
                    });
                }
            );
        }
    });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check for user
        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }

        if(user.validation) {

            // Check Password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {
                    // User Matched
                    const payload = {
                        id: user.id,
                        email: email,
                        avatar: user.avatar
                    }; // Create JWT Payload

                    // Sign Token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {expiresIn: 3600},
                        (err, token) => {
                            res.json({
                                success: true,
                                token: token,
                                payload: payload
                            });
                        }
                    );
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(400).json(errors);
                }
            });
        }//end if(validation)
        else{
            return res.status(404).json(errors)
        }
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            email: req.user.email
        });
    }
);

module.exports = router;