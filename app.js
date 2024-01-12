const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const methodoverride=require('method-override');
const ejsmate=require('ejs-mate');
const ExpressError=require('./utils/ExpressError.js');
const listings=require('./routes/listings.js');
const reviews=require('./routes/review.js');
const home=require('./routes/home.js');
const session=require('express-session');
const flash=require('connect-flash');

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

////Route path
// app.get('/',(req,res)=>{
//     res.render('./listings/home.ejs');
// })

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

////directing the success in index.ejs
app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.err=req.flash('failure')
    next();
})

////USINGS common path here and direct in there folder rest path added in files
app.use('/listings',listings)
app.use('/listings/:id/reviews',reviews)
app.use('/',home);



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
