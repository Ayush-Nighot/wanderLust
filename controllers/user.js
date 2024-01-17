const User=require('../models/User.js');

// signUP form render route
module.exports.signUpForm=(req,res)=>{
    res.render('users/signup.ejs');
}

///signup post route
module.exports.signUpPost=async(req,res)=>{
    let {username,email,password}=req.body;
    try {
        const newUser=new User({
            email:email,
            username:username
        })
        const registeredUser=await User.register(newUser,password)
        // console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","Welcome to WanderLust")
            res.redirect('/listings');
        })
    } catch (err) {
        req.flash('failure',(err.message));
        res.redirect('/signup');
    }
}

// login form route
module.exports.loginForm=(req,res)=>{
    res.render('users/login.ejs');
}

// Login route
module.exports.loginAuth=async(req,res)=>{
        req.flash("success","User Logged In Successfully.")
        let redirectUrl=res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
}

// logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err)
        }else{
            req.flash('success',"You are successfully logged out!")
            res.redirect('/listings')
        }
    })
}