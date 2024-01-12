const express=require('express');
////Like we do urlecoded = true in app.js to get data from url//we have to do here mergeparams true so the data from app.js come here also
const router=express.Router({mergeParams:true});
const wrapasync=require('../utils/wrapasync.js')
const {reviewSchema}=require('../schema.js')
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js')
const Review=require('../models/review.js');

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

// /listings/:id/reviews we have cut this common part from both routes post and delete in place /

// ReviewsPost Route
router.post('/',validateReview, wrapasync(async(req,res,next)=>{

    let {id}=req.params;
    let{reviews}=req.body;
    let listing=await Listing.findById(id);
    let newReview=new Review(reviews)
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save()
    console.log('new review saved');
    res.redirect(`/listings/${id}`);
}))



////Delete Review route
router.delete('/:reviewId',wrapasync(async(req,res)=>{
    let {id,reviewId}=req.params;
    /////$pull means remove///It means in reviews array which ever will be matched with reviewID will be deleted
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);

}))


module.exports=router;