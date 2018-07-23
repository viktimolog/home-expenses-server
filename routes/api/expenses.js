const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const Expense = require('../../models/Expense');

// @route   GET api/expenses/test
// @desc    Tests expenses route
// @access  Public
//POSTMAN ok http://localhost:5000/api/expenses/test
router.get('/test', (req, res) => res.json({
    msg: "Expenses works"
}));

// @route   GET api/expenses
// @desc    Get expenses
// @access  Public
//POSTMAN OK http://localhost:5000/api/expenses/getExpenses
router.get('/getExpenses', (req, res) => {
    Expense.find()
        .then(expenses => res.json(expenses))
        .catch(err => res.status(404).json({noexpensesfound: 'No expenses found'}));
});

// @route  POST api/expenses/addExpense
// @desc   addExpense
// @access Public
//POSTMAN OK http://localhost:5000/api/expenses/addExpense
// date: 1531991436550
// category: Category 1
// expense: dorogo
// valueUAH: 10.25
//idCategory: 5b5447357f58b21cae12e5d6

router.post('/addExpense', (req, res) => {
    Expense.findOne({
        date: req.body.date,
        category: req.body.category,
        expense: req.body.expense,
        valueUAH: req.body.valueUAH,
        idCategory: req.body.idCategory
    })
        .then(expense => {
            if (expense) {
                res.json({
                    success: false
                });
            } else {
                const newExpense = new Expense({
                    date: req.body.date,
                    category: req.body.category,
                    expense: req.body.expense,
                    valueUAH: req.body.valueUAH,
                    idCategory: req.body.idCategory
                });
                newExpense.save()
                    .then(expense => {
                        if (expense) {
                            res.json({
                                success: true,
                                expense: expense
                            });
                        } else {
                            return res.status(400).json({msg: 'Error on the server! Expense has not added'});
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
})

// @route   Update api/expenses/:id
// @desc    Update expense
// @access  Public
//POSTMAN OK
//PUT http://localhost:5000/api/expenses/updateExpense/...
// _id 5b5456b9a5be4f25330d85fe
// date 1531991436550
// category Category 1 (deleted)
//expense car paid
//valueUAH 12345.98
//idCategory 5b557d539385ce1c4f3337c8

router.put('/updateExpense/:id', (req, res) => {
    Expense.findOne({
        date: req.body.date,
        category: req.body.category,
        expense: req.body.expense,
        valueUAH: req.body.valueUAH,
        idCategory: req.body.idCategory
    })
        .then(expense => {
            if (expense)
                return res.json({ success: false })
            else {
                Expense.findById(req.params.id)
                    .then(expense => {
                        expense.date = req.body.date,
                        expense.category = req.body.category,
                        expense.expense = req.body.expense,
                        expense.valueUAH = req.body.valueUAH,
                        expense.idCategory = req.body.idCategory

                        expense.save().then(expense => {
                            if (expense) {
                                res.json({ success: true });
                                expense.json(expense)
                            } else
                                return res.status(400).json({ msg: 'Error on the server! Expense has not edited' });
                        });
                    })
                    .catch(err => res.status(404).json({ expensenotfound: 'No expense found' }));
            }
        })
})

module.exports = router;