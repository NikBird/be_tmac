const express = require('express')
const routes = require('./src/routes/index');
const app = express();
const bodyParser = require('body-parser')
const session = require('express-session');
const mongoose = require('mongoose');

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/images', express.static(__dirname + 'public/images'))
app.use('/js', express.static(__dirname + 'public/js'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }))

app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: process.env.SEC
}));

app.use('/', routes);
app.use(function(req, res, next){
  res.locals.user=req.session.user;
  next();
});

module.exports = app;