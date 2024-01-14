const express=require('express');
////Like we do urlecoded = true in app.js to get data from url//we have to do here mergeparams true so the data from app.js come here also
const router=express.Router({mergeParams:true});
const wrapasync=require('../utils/wrapasync.js')
const {listingSchema}=require('../schema.js')
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js')


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}


////Index Route
router.get('/',wrapasync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}))

////NEW(This new route should be before show route because if not the browser will take new param as id)
// router.get('/new',(req,res)=>{
//     res.render('./listings/newForm.ejs')
// })

// New Route
// router.get('/new',(req,res)=>{
//     if(!req.isAuthenticated()){
//         req.flash('failure',"You must be logged in to create listing")
//         // res.redirect('/signup')
//         res.redirect('/login');
//     }
//     res.render('./listings/newForm.ejs')
// })
// New Route
router.get('/new',(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash('failure',"You must be logged in to create listing")
        // res.redirect('/signup')
        res.redirect('/login');
    }
    res.render('./listings/newForm.ejs')
})
////SHOW Route
router.get('/:id',wrapasync(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id).populate('reviews');
    if(!list){
        req.flash('failure',"Listing You requested for does not exist.")
        res.redirect('/listings');
    }
    res.render('./listings/show.ejs',{list})
}))

////create route
router.post('/',validateListing,wrapasync(async(req,res,next)=>{
    // let {title,description,price,image,country,location}=req.body;
    // let newList=new Listing({
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country
    // })
    // await newList.save()
    ////OR
        const newListing=new Listing(req.body.listing);
        await newListing.save();
        req.flash('success',"New Listing Created!");
        res.redirect('/listings');
}))


////edit route
router.get('/:id/edit',wrapasync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    if(!listing){
        req.flash('failure',"Listing You requested for does not exist.")
        res.redirect('/listings');
    }
    res.render('./listings/edit.ejs',{listing});
}))

////update
router.put('/:id',wrapasync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
}))

////delete route
router.delete('/:id',wrapasync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash('failure',"Listing deleted Successfully")
    return res.redirect('/listings');
}))



module.exports=router;