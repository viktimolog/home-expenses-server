const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const SubCategory = require('../../models/SubCategory');

// @route   GET api/subCategories/test
// @desc    Tests subCategories route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "SubCategories works"
}));

// @route   GET api/subCategories
// @desc    Get subCategories
// @access  Public
//POSTMAN OK http://localhost:5000/api/subCategories/getSubCategories
router.get('/getSubCategories', (req, res) => {
    SubCategory.find()
        .then(subCategories => res.json(subCategories))
        .catch(err => res.status(404).json({ nosubCategoriesfound: 'No subCategories found' }));
});

// @route  POST api/categories/addSubCategories
// @desc   addSubCategory
// @access Public
//POSTMAN OK http://localhost:5000/api/subCategories/addSubCategory
// idCategory 5b5447357f58b21cae12e5d6
// name Category 2
// rating 1
// idParent 5b5447357f58b21cae12e5d7
router.post('/addSubCategory', (req, res) => {
    SubCategory.findOne({
        idCategory: req.body.idCategory,
        rating: req.body.rating,
        idParent: req.body.idParent
    })
        .then(category => {
            if (category) {
                res.json({
                    success: false
                });
            } else {
                const newCategory = new SubCategory({
                    idCategory: req.body.idCategory,
                    rating: req.body.rating,
                    idParent: req.body.idParent
                });
                newCategory.save()
                    .then(category => {
                        if (category) {
                            res.json({
                                success: true,
                                category: category
                            });
                        } else {
                            return res.status(400).json({ msg: 'Error on the server! SubCategory has not added' });
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
})

// @route   DELETE api/subCategories/:id
// @desc    Delete subCategory
// @access  Public
//POSTMAN OK http://localhost:5000/api/subCategories/delSubCategory/5b545a40b7abd6276d32f1d9
router.delete('/delSubCategory/:id', (req, res) => {
    SubCategory.findById(req.params.id)
            .then(category => {
                // Delete
                category.remove().then(() => res.json({ success: true }));
            })
            .catch(err => res.status(404).json({ subCategorynotfound: 'No subCategory found' }));
    }
);

// @route   Update api/subCategories/:id
// @desc    Update subCategory
// @access  Public
//POSTMAN OK
//PUT http://localhost:5000/api/subCategories/updateSubCategory/5b545bcbbd3c5727d7796d7c
// _id 5b545bcbbd3c5727d7796d7c
// name Category 2 update - deleted
// rating 2
// idParent 5b5447357f58b21cae12e5d7
// idCategory 5b5447357f58b21cae12e5d6

router.put('/updateSubCategory/:id', (req, res) => {
    SubCategory.findOne({
        idCategory: req.body.idCategory,
        rating: req.body.rating,
        idParent: req.body.idParent
    })
        .then(category => {
            if (category)
                return res.json({ success: false })
            else {
                SubCategory.findById(req.params.id)
                    .then(category => {
                        category.idCategory = req.body.idCategory;
                        category.rating = req.body.rating;
                        category.idParent = req.body.idParent;

                        category.save().then(category => {
                            if (category) {
                                res.json({ success: true });
                                category.json(category)
                            } else
                                return res.status(400).json({ msg: 'Error on the server! SubCategory has not edited' });
                        });
                    })
                    .catch(err => res.status(404).json({ categorynotfound: 'No subCategory found' }));
            }
        })
})

module.exports = router;