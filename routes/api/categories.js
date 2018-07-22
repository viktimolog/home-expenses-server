const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const Category = require('../../models/Category');

// @route   GET api/categories/test
// @desc    Tests categories route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Categories works"
}));

// @route  POST api/categories/addCategory
// @desc   addCategory
// @access Public
router.post('/addCategory', (req, res) => {
    Category.findOne({
        name: req.body.name,
        rating: req.body.rating,
        parent: req.body.parent,
        child: req.body.child
    })
        .then(item => {
            if (item) {
                res.json({
                    success: false
                });
            } else {
                const newCategory = new Category({
                    name: req.body.name,
                    rating: req.body.rating,
                    parent: req.body.parent,
                    child: req.body.child
                });
                newCategory.save()
                    .then(item => {
                        if (item) {
                            res.json({
                                success: true,
                                category: item
                            });
                        } else {
                            return res.status(400).json({ msg: 'Error on the server! Category has not added' });
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
})

module.exports = router;