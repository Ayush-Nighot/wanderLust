const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodoverride=require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const listingsRouter=require('./routes/listings.js');
const reviewsRouter=require('./routes/review.js');
const homeRouter=require('./routes/home.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('./models/User.js');
const userRouter=require('./routes/user.js');

////To get data from url if we want to use req.body req.params etc
app.use(express.urlencoded({extended:true}));
app.use(express.json());

////To use ejs and direct it in the views folder
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

////EJS MATE for using common layout in all ejs files
app.engine('ejs',ejsmate);

////To use delete update method which is not supported in form html
app.use(methodoverride('_method'));

////To direct the style or js in public folder
app.use(express.static(path.join(__dirname,"public")));

////Basics While using Mongo
async function main(){
    let mongoURL="mongodb://localhost:27017/wanderLust";
    await mongoose.connect(mongoURL);
}
main().then((res)=>console.log("connected to DB")).catch((err)=>console.log(err))

////Creating session
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        // 7day 24hrs 60 min 60 sec 1000ms
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}
app.use(session(sessionOptions));

// //Using flash /////This should be use before the routes like app.use('/listings',lisings) or app.use('/listings/:id/reviews',reviews) because we are going to use flash on the basics of them
app.use(flash());

// PASSPORT
// To use passport we need to ensure that we have created our session

// Implementation of passport ///For every req password is initialized
app.use(passport.initialize());

////In one session a user change req many time but we need that he should only need to sign in only one time in session///Thats why we use app.use(passport.session());
app.use(passport.session());

// All the new user came should be authenticate from LocalStrategy and to authenticate them authenticate() method is used 
passport.use(new LocalStrategy(User.authenticate()));

//All the information related to user stored in session is called serializeUser 
passport.serializeUser(User.serializeUser())

//All the information related to user remove from session is called deserializeUser
passport.deserializeUser(User.deserializeUser())


////directing the success in index.ejs
app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.err=req.flash('failure')
    res.locals.currUser=req.user;
    next();
})

////USINGS common path here and direct in there folder rest path added in files(ROUTER)
app.use('/listings',listingsRouter)
app.use('/listings/:id/reviews',reviewsRouter)
app.use('/',homeRouter);
app.use('/',userRouter)


////In case any other invalid path
app.all('*',(req,res,next)=>{
    return next(new ExpressError(404,"Page Not Found!!"))
})

/////Error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong"}=err;
    res.status(status).render('./listings/error.ejs',{err});
    // res.status(status).send(message);
})

////port
app.listen(8080,()=>{
    console.log("App is listening at port 8080")
})


// Comments Explanations:
// <!--app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })
//     ////register is a static method here 1st parameter is object and second is password
//     // register method will also confirm that the username is unique or not
//     let registeredUser=await User.register(fakeUser,'helloWorld')
//     res.send(registeredUser)
// })-->