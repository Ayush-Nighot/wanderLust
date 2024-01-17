const Listing=require('../models/listing');

// Index
module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
};

// New Route
module.exports.newRoute=(req,res)=>{
    res.render('./listings/newForm.ejs')
};

// Show Route
module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    // .populate will give all the information related to it for ex reviews and owner////without populate if we just did find by id it will just show us the id of reviews and not its whole information
    // with every listing we will populate reviews and with every reviews we will populate author information////nested populate
    let list=await Listing.findById(id).populate(
        {
            path:'reviews',
            populate:{
            path:'author'
        }
        }
        ).populate("owner");
    if(!list){
        req.flash('failure',"Listing You requested for does not exist.")
        res.redirect('/listings');
    }
    res.render('./listings/show.ejs',{list})
};

// Create Route
module.exports.createRoute=async(req,res,next)=>{
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
        // /passport add user default so req.user means current user
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash('success',"New Listing Created!");
        res.redirect('/listings');
};

// Edit Route
module.exports.editRoute=async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash('failure',"Listing You requested for does not exist.")
        res.redirect('/listings');
    }
    res.render('./listings/edit.ejs',{listing});
};

// Update Route
module.exports.updateRoute=async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
};

// Delete Route
module.exports.deleteRoute=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    req.flash('failure',"Listing deleted Successfully")
    return res.redirect('/listings');
};