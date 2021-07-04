const express = require('express');
const mongoose = require('mongoose');
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var Ddos = require('ddos')
var ddos = new Ddos({burst:3, limit:6})
    
    
var credentials = {key: privateKey, cert: certificate};

const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser, checkadmin, checkSuperadmin, verifiedAccount } = require('./middleware/authMiddleware');

const app = express();
app.use(ddos.express);
var httpsServer = https.createServer(credentials, app);

const xXssProtection = require("x-xss-protection");

var helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: false
}))



// Set "X-XSS-Protection
app.use(xXssProtection());

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

PORT = 3000;

// database connection
const dbURI = 'mongodb+srv://thushara:e16388com@cluster0.whce1.mongodb.net/project';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => httpsServer.listen(PORT))
  .catch((err) => console.log(err));

console.log("App listens in port "+ PORT);
// routes
app.get('*', checkUser);
app.get('/', verifiedAccount , requireAuth, (req, res) => res.render('home',{ details: null }));
app.get('/confirm', requireAuth , (req, res) => res.render('confirm'));
app.get('/adminView',verifiedAccount, requireAuth, checkadmin, (req, res) => res.render('adminView'));
app.get('/sadmin',verifiedAccount, checkadmin, (req, res) => res.render('sadmin'));

app.get('/superView',verifiedAccount, checkSuperadmin, (req, res) => res.render('superView'));
app.get('/tooManyRequests', (req, res) => res.render('tooManyRequests'));
app.get('/test', (req, res) => res.render('test'));
app.get('/announce', (req, res) => res.render('announce'));
app.get('/customers', (req, res) => res.render('customers'));




app.use(authRoutes);

app.use((req, res, next) => {
  res.status(404).send({msg : "not valid request"});
  next();
})

module.exports = app;

