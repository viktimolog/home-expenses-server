const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    parent: {
        type: Boolean,
        required: true
    },
    child: {
        type: Boolean,
        required: true
    }
});

module.exports = SubCategory = mongoose.model('categories', CategorySchema);
