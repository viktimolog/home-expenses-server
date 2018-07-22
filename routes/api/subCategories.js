const express = require('express');
const router = express.Router();
// const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// @route   GET api/subCategories/test
// @desc    Tests subCategories route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "SubCategories works"
}));

module.exports = router;