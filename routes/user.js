const express=require('express');
const wrapasync = require('../utils/wrapasync');
const router=express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const {signUpForm, signUpPost,loginForm,loginAuth,logout}=require('../controllers/user.js');

// SignUP
router.get('/signup',signUpForm);

// signUpPost
router.post('/signup',wrapasync(signUpPost))

// Login
router.get('/login',loginForm)

// Authentication using passport
router.post('/login',saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:{
    type:'failure',
    message:'Username or password is incorrect'
}}),loginAuth)

// Logout
router.get('/logout',logout)

module.exports=router;
