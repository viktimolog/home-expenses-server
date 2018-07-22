const express = require('express');
const router = express.Router();
// const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route   GET api/expenses/test
// @desc    Tests expenses route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Expenses works"
}));

module.exports = router;