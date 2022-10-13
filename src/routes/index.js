const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser');
const axios = require('axios')
const router = express.Router();
require('../utils/user');
require('../utils/mods');
const mongoose = require('mongoose');
const User = mongoose.model('UserModel');
const { fetchMod } = require('../utils/db')
const Mods = mongoose.model('ModsModel');
var session = require('express-session');
var app = express();

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: process.env.SEC
}));
app.use(function(req, res, next){
    res.locals.user=req.session.user;
    next();
});

router.use(cookieParser());
router.get('', async (req, res) => {res.render('index')})

router.post('/deleteUser/:id', async (req, res) => {
    try {
        await User.deleteOne(
            { username: req.params.id }

        );
        res.redirect('/verify')
      } catch (err) {
        console.log("Error while updating user :============> ", err);
        res.status(500).json(  err);
      }
})

router.get('/verify', async (req, res) => {
    if(req.session.user==null){
        res.redirect('/');
        } 
            else 
        {
            User.find({status:true}).exec((errVerifed,verified)=>{
                User.find({status:false}).exec((errDenied,denied)=>{
                    if(!errDenied){
                        res.render('verify',{ verified: verified , denied:denied,data:false,add:false });
                    } else{
                        res.redirect('/accounts');
                    }
                });
            });
        }
   });

router.post('/editUser/:id', async (req, res) => {
    try {
        await User.updateOne(
            { username: req.params.id },
            {
                status: req.body.status,
            }
        );
        res.redirect('/verify')
      } catch (err) {
        console.log("Error while updating user :============> ", err);
        res.status(500).json(  err);
      }
})

router.post('/addUser/:id', async (req, res) => {
    const user=new User();
    user.status=req.body.status;
    user.username=req.params.id;
    user.requestedBy='theDigitalCat#5146 <@667197650654986250>';
    user.requestedById='667197650654986250';
    user.statusUpdateBy='theDigitalCat#5146 <@667197650654986250>'
    user.statusUpdateById='667197650654986250';

    var d = new Date();
    user.statusUpdateTime=d.toDateString()+' '+d.toLocaleTimeString();
    try {
        await user.save();
        res.redirect('/verify')
    } 
        catch (error) {
        res.status(500).send(error);
    }
});

router.post('/verify', async (req, res) => {
    userQuery=req.body.username;
    var username= '';
    var status=''
    var data = false;
    try {
        let user = await User.findOne({
            username: req.body.username,
        }).lean();
        User.find({status:true}).exec((errVerifed,verified)=>{
            User.find({status:false}).exec((errDenied,denied)=>{
                if(!errDenied){
                    if(user){
                        data = true;
                        username=user.username
                        status=user.status;
                        res.render('verify',{
                            data:data,
                            username:username,
                            status:status,verified: verified , denied:denied
                        });
                    }else{
                        res.render('verify',{
                            add:true,
                            data:data,
                            username:req.body.username,
                            status:status,verified: verified , denied:denied
                        });
                    }
                } else{
                    res.redirect('/');
                }
            });
        });    
    } catch (err) {
        return res.status(500).json({ message: "Error finding user " });
    }
})

router.post('/login', async function (req, res) {
    const  username= req.body.username;
    const  password = req.body.password;
    Mods.find({username:username,password:password}).exec((err,result)=>{
        if(result.length>0){
            req.session.regenerate(function(){
                req.session.user =  {result};
                res.redirect('/verify')         
            });
        } else {
            res.send('<script>alert("Please Verify your Credentiels! "); window.location.href = "/"; </script>');
        }
    });
});

router.post('/logout',function(req,res){
    req.session.user=null;
    res.redirect('/');
});

router.get('/accounts', async (req, res) => {res.render('accounts')})
router.get('/spam', async (req, res) => {res.render('spam')})

module.exports = router;