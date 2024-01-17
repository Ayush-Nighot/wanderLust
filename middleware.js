const Listing=require('./models/listing.js');
const Review=require('./models/review.js')
const {reviewSchema}=require('./schema.js')
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema}=require('./schema.js');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.user)
        // console.log(req.path,req.originalUrl)
        req.session.redirectUrl=req.originalUrl;
    req.flash('failure',"You must be logged in to create listing")
    res.redirect('/login');
    }
    next();
} 

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
/////req.user is an passport method which return the object in isAuthenticate
////we cannot access req.user directly in our navbar.ejs so we have to declare it in locals


module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash('failure',"You don't have permission to edit");
        res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewID}=req.params;
    let review=await Review.findById(reviewID);
    if(!res.locals.currUser._id.equals(review.author)){
        req.flash('failure',"You don't have permission to edit the review");
        res.redirect(`/listings/${id}`);
    }
    console.log(review)
    next();
}

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}