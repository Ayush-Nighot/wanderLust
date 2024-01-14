const express=require('express');
const wrapasync = require('../utils/wrapasync');
const router=express.Router();
const User=require('../models/User.js');
const passport = require('passport');

// SignUP
router.get('/signup',(req,res)=>{
    res.render('users/signup.ejs');
})


router.post('/signup',wrapasync(async(req,res)=>{
    let {username,email,password}=req.body;
    try {
        const newUser=new User({
            email:email,
            username:username
        })
        const registeredUser=await User.register(newUser,password)
        req.flash("success","User registered Successfully")
        console.log(registeredUser)
        res.redirect('/listings');
    } catch (err) {
        req.flash('failure',(err.message));
        res.redirect('/signup');
    }
}))

// Login
router.get('/login',(req,res)=>{
    res.render('users/login.ejs');
})

// Authentication using passport
router.post('/login',passport.authenticate('local',{failureRedirect:'/login',failureFlash:{
    type:'failure',
    message:'Username or password is incorrect'
}}),async(req,res)=>{
        req.flash("success","User Logged In Successfully.")
        res.redirect('/listings');
})

module.exports=router;
