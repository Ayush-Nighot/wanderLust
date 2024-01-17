const express=require('express');
////Like we do urlecoded = true in app.js to get data from url//we have to do here mergeparams true so the data from app.js come here also
const router=express.Router({mergeParams:true});
const {isLoggedIn, isOwner,validateListing}=require('../middleware.js');
const wrapasync=require('../utils/wrapasync.js')
const {index,newRoute,showRoute, createRoute, editRoute, updateRoute,deleteRoute}=require('../controllers/listings.js')

////Index Route
router.get('/',wrapasync(index))

////NEW(This new route should be before show route because if not the browser will take new param as id)

// New Route
router.get('/new',isLoggedIn,newRoute)

////SHOW Route
router.get('/:id',wrapasync(showRoute))

////create route
router.post('/',validateListing,wrapasync(createRoute));


////edit route
router.get('/:id/edit',isLoggedIn,isOwner,wrapasync(editRoute));

////update Route
router.put('/:id',isLoggedIn,isOwner,wrapasync(updateRoute));

////delete route
router.delete('/:id',isLoggedIn,isOwner,wrapasync(deleteRoute))

module.exports=router;