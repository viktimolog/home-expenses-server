const express = require('express');
const router = express.Router();
// const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route   GET api/categories/test
// @desc    Tests categories route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Categories works"
}));

module.exports = router;