const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const Category = require('../../models/Category');
const User = require('../../models/User');

//old
router.delete('/delCategory1/:id', (req, res) => {
        Category.findById(req.params.id)
            .then(category => {
                // Delete
                category.remove().then(() => res.json({ success: true }));
            })
            .catch(err => res.status(404).json({ categorynotfound: 'No category found' }));
    }
);

// @route   DELETE api/categories/:id
// @desc    Delete category
// @access  Public
//POSTMAN http://localhost:5000/api/categories/delCategory/5b5447757f58b21cae12e5d8 OK
router.delete('/delCategory/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Category.findById(req.params.id)
            .then(category => {
                // Delete
                category.remove().then(() => res.json({success: true}));
            })
            .catch(err => res.status(404).json({categorynotfound: 'No category found'}));
    }
)

// @route   GET api/categories/test
// @desc    Tests categories route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Categories works"
}));

// @route   GET api/categories
// @desc    Get categories
// @access  Public
//POSTMAN OK http://localhost:5000/api/categories/getCategories
router.get('/getCategories', (req, res) => {
    Category.find()
        .sort({ name: 1 })
        .then(categories => res.json(categories))
        .catch(err => res.status(404).json({ nocategoriesfound: 'No categories found' }));
});

// @route  POST api/categories/addCategory
// @desc   addCategory
// @access Public
//POSTMAN http://localhost:5000/api/categories/addCategory OK
// name Category 2
// rating 2
// parent false
// child false
router.post('/addCategory', (req, res) => {
    Category.findOne({
        name: req.body.name,
        rating: req.body.rating,
        parent: req.body.parent,
        child: req.body.child
    })
        .then(category => {
            if (category) {
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
                    .then(category => {
                        if (category) {
                            res.json({
                                success: true,
                                category: category
                            });
                        } else {
                            return res.status(400).json({ msg: 'Error on the server! Category has not added' });
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
})

// @route   Update api/categories/:id
// @desc    Update category
// @access  Public
//POSTMAN OK
//PUT http://localhost:5000/api/categories/updateCategory/5b5447357f58b21cae12e5d6
// _id 5b5447357f58b21cae12e5d6
// name Category 1 update
// rating 1
// parent false
// child true

router.put('/updateCategory/:id', (req, res) => {
    Category.findOne({
        name: req.body.name,
        rating: req.body.rating,
        parent: req.body.parent,
        child: req.body.child
    })
        .then(category => {
            if (category)
                return res.json({ success: false })
            else {
                Category.findById(req.params.id)
                    .then(category => {
                        category.name = req.body.name;
                        category.rating = req.body.rating;
                        category.parent = req.body.parent;
                        category.child = req.body.child;

                        category.save().then(category => {
                            if (category) {
                                res.json({ success: true });
                                category.json(category)
                            } else
                                return res.status(400).json({ msg: 'Error on the server! Category has not edited' });
                        });
                    })
                    .catch(err => res.status(404).json({ categorynotfound: 'No category found' }));
            }
        })
})

module.exports = router;