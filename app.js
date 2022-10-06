var express = require('express')
const routes = require('./src/routes/index');
const app = express();
const bodyParser = require('body-parser')
var session = require('express-session');
require('./src/utils/mods');
const mongoose = require('mongoose');

const Mods = mongoose.model('ModsModel');
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
    secret: 'shhhh, very secre'
  
  }));
app.use('/', routes);




  app.use(function(req, res, next){
    res.locals.user=req.session.user;
 
    next();
  });

  var mods = {
    username: "admin123",
    password: "admin123",
    
}
const admin =  Mods.findOne({
  username: "admin123",
}).then(res => {

  if(res==null){
    Mods.create(mods, function(e) {
  
      if (e) {
          throw e;
      }
  });
  }

});

module.exports = app;
