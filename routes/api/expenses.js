const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt_decode = require('jwt-decode');

const Expense = require('../../models/Expense');

// @route   GET api/expenses/test
// @desc    Tests expenses route
// @access  Public
router.get('/test', (req, res) => res.json({
    msg: "Expenses works"
}));

// @route   GET api/expenses
// @desc    Get expenses
// @access  Public
router.get('/getExpenses',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const token = req.headers.authorization.substring(7);
        const decodedToken = jwt_decode(token);
        const idUser = decodedToken.id;
        Expense.find()
            .then(expenses => expenses.filter(exp => exp.idUser === idUser))
            .then(expenses => res.json(expenses))
            .catch(err => res.status(404).json({noexpensesfound: 'No expenses found'}));
    });

// @route  POST api/expenses/addExpense
// @desc   addExpense
// @access Public
router.post('/addExpense',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const idUser = jwt_decode(req.headers.authorization.substring(7)).id;
        Expense.findOne({
            idUser: idUser,
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
                        idUser: idUser,
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
router.put('/updateExpense/:id',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const idUser = jwt_decode(req.headers.authorization.substring(7)).id;
        Expense.findOne({
            idUser: idUser,
            date: req.body.date,
            category: req.body.category,
            expense: req.body.expense,
            valueUAH: req.body.valueUAH,
            idCategory: req.body.idCategory
        })
            .then(expense => {
                if (expense)
                    return res.json({success: false})
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
                                    res.json({success: true});
                                    expense.json(expense)
                                } else
                                    return res.status(400).json({msg: 'Error on the server! Expense has not edited'});
                            });
                        })
                        .catch(err => res.status(404).json({expensenotfound: 'No expense found'}));
                }
            })
    })

module.exports = router;
