const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParcer = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const categories = require('./routes/api/categories');
const expenses = require('./routes/api/expenses');

const app = express();

// Body parcer middleware
app.use(bodyParcer.urlencoded({extended: false}));
app.use(bodyParcer.json());


// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

const port = process.env.PORT || 7777

app.use(cors());
app.get('/', (req, res) => res
    .send('This server was created for https://github.com/viktimolog/home-expenses'))

// Use Routes
app.use('/api/users', users);
app.use('/api/categories', categories);
app.use('/api/expenses', expenses);

app.listen(port, () => console.log(`Listening on ${port}`))
