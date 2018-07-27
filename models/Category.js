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
    idParent: {
        type: String,
        required: true
    },
    isParent: {
        type: Boolean,
        required: true
    },
    isChild: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

module.exports = SubCategory = mongoose.model('categories', CategorySchema);
