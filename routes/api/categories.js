const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt_decode = require('jwt-decode');

const Category = require('../../models/Category');

// @route   DELETE api/categories/:id
// @desc    Delete category
// @access  Public
router.delete('/delCategory/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        Category.findById(req.params.id)
            .then(category => {
                // Delete
                category.remove().then(() => res.json({success: true}));
            })
            .catch(err => res.status(404).json({categorynotfound: 'No category found'}));
    }
);

// @route   GET api/categories
// @desc    Get categories
// @access  Public
router.get('/getCategories',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const idUser = jwt_decode(req.headers.authorization.substring(7)).id;
        Category.find()
            .sort({idParent: 1})
            .sort({rating: 1})
            .then(categories => categories.filter(cat => cat.idUser === idUser))
            .then(categories => res.json(categories))
            .catch(err => res.status(404).json({nocategoriesfound: 'No categories found'}));
    });

// @route  POST api/categories/addCategory
// @desc   addCategory
// @access Public
router.post('/addCategory',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const idUser = jwt_decode(req.headers.authorization.substring(7)).id;
        Category.findOne({
            idUser: idUser,
            name: req.body.name,
            idParent: req.body.idParent,
            isParent: req.body.isParent,
            isChild: req.body.isChild,
            rating: req.body.rating
        })
            .then(category => {
                if (category) {
                    res.json({
                        success: false
                    });
                } else {
                    const newCategory = new Category({
                        idUser: idUser,
                        name: req.body.name,
                        idParent: req.body.idParent,
                        isParent: req.body.isParent,
                        isChild: req.body.isChild,
                        rating: req.body.rating
                    });
                    newCategory.save()
                        .then(category => {
                            if (category) {
                                res.json({
                                    success: true,
                                    category: category
                                });
                            } else {
                                return res.status(400).json({msg: 'Error on the server! Category has not added'});
                            }
                        })
                        .catch(err => console.log(err));
                }
            })
    })


// @route   GET api/categories/test
// @desc    Tests categories route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Categories works"
}));

// @route   Update api/categories/:id
// @desc    Update category
// @access  Public
router.put('/updateCategory/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const idUser = jwt_decode(req.headers.authorization.substring(7)).id;
        Category.findOne({
            idUser: idUser,
            name: req.body.name,
            idParent: req.body.idParent,
            isParent: req.body.isParent,
            isChild: req.body.isChild,
            rating: req.body.rating
        })
            .then(category => {
                if (category)
                    return res.json({success: false})
                else {
                    Category.findById(req.params.id)
                        .then(category => {
                            category.idUser = idUser,
                                category.name = req.body.name,
                                category.idParent = req.body.idParent,
                                category.isParent = req.body.isParent,
                                category.isChild = req.body.isChild,
                                category.rating = req.body.rating

                            category.save().then(category => {
                                if (category) {
                                    res.json({success: true});
                                    category.json(category)
                                } else
                                    return res.status(400).json({msg: 'Error on the server! Category has not edited'});
                            });
                        })
                        .catch(err => res.status(404).json({categorynotfound: 'No category found'}));
                }
            })
    })

module.exports = router;
