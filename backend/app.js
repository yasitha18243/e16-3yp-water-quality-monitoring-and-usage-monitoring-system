const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, checkadmin, checkSuperadmin, verifiedAccount } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://thushara:e16388com@cluster0.whce1.mongodb.net/project';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', verifiedAccount , requireAuth, (req, res) => res.render('home',{ details: null }));
app.get('/confirm', (req, res) => res.render('confirm'));
//app.get('/tanks',verifiedAccount, requireAuth, (req, res) => res.render('tanks'));
app.get('/sadmin',verifiedAccount, checkadmin, (req, res) => res.render('sadmin'));

app.get('/superView',verifiedAccount, checkSuperadmin, (req, res) => res.render('superView'));


app.use(authRoutes);

app.use((req, res, next) => {
  res.status(404).send({msg : "not valid request"});
  next();
})

module.exports = app;

