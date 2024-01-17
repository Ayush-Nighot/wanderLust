const express=require('express');
////Like we do urlecoded = true in app.js to get data from url//we have to do here mergeparams true so the data from app.js come here also
const router=express.Router({mergeParams:true});
const wrapasync=require('../utils/wrapasync.js')
const {validateReview, isLoggedIn}=require('../middleware.js');
const {reviewPost, deleteReview}=require('../controllers/review.js');
// /listings/:id/reviews we have cut this common part from both routes post and delete in place /

// ReviewsPost Route
router.post('/',isLoggedIn,validateReview,wrapasync(reviewPost));

////Delete Review route
router.delete('/:reviewId',isLoggedIn,wrapasync(deleteReview))


module.exports=router;