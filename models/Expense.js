const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const ExpenseSchema = new Schema({
    idUser: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    expense: {
        type: String,
        required: true
    },
    valueUAH: {
        type: Number,
        required: true
    },
    idCategory: {
        type: String,
        required: true
    },
});

module.exports = Expense = mongoose.model('expenses', ExpenseSchema);
