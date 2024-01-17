const Listing=require('../models/listing.js')
const Review=require('../models/review.js');

// review post route
module.exports.reviewPost=async(req,res,next)=>{
    let {id}=req.params;
    let{reviews}=req.body;
    let listing=await Listing.findById(id);
    let newReview=new Review(reviews)
    newReview.author=req.user._id;
    listing.reviews.push(newReview)
    await newReview.save();
    await listing.save()
    console.log('new review saved');
    res.redirect(`/listings/${id}`);
};

// delete review route
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    /////$pull means remove///It means in reviews array which ever will be matched with reviewID will be deleted
    let review=await Review.findById(reviewId);
    if(!res.locals.currUser._id.equals(review.author)){
        req.flash('failure',"You don't have permission to edit the review");
        res.redirect(`/listings/${id}`);
    }else{
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Review Deleted")
    res.redirect(`/listings/${id}`);
    }
};