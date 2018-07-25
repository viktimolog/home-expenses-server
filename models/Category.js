const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const CategorySchema = new Schema({
    idUser: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: false
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
