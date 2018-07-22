const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const SubCategorySchema = new Schema({
    idCategory: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    idParent: {
        type: String,
        required: true
    }
});

module.exports = SubCategory = mongoose.model('subCategories', SubCategorySchema);