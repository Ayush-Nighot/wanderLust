const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const ejs=require('ejs');
const methodoverride=require('method-override');
const Listing=require('./models/listing.js')
const ejsmate=require('ejs-mate');
const wrapasync=require('./utils/wrapasync.js')
const ExpressError=require('./utils/ExpressError.js');
const { wrap } = require('module');
const {listingSchema}=require('./schema.js')
const Review=require('./models/review.js');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.engine('ejs',ejsmate);

app.use(methodoverride('_method'));

app.use(express.static(path.join(__dirname,"public")));

async function main(){
    let mongoURL="mongodb://localhost:27017/wanderLust";
    await mongoose.connect(mongoURL);
}

main().then((res)=>console.log("connected to DB")).catch((err)=>console.log(err))


app.get('/',(req,res)=>{
    res.render('./listings/home.ejs');
})

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>{
            el.message.join(',')
        })
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

// app.get('/testListing',async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"calangute,goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send('Successful Testing')
// });

////Index Route
app.get('/listings',wrapasync(async(req,res)=>{
    let allListings=await Listing.find({});
    res.render('./listings/index.ejs',{allListings});
}))

////NEW(This new route should be before show route because if not the browser will take new param as id)
app.get('/listings/new',(req,res)=>{
    res.render('./listings/newForm.ejs')
})

////SHOW Route
app.get('/listings/:id',wrapasync(async(req,res)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    res.render('./listings/show.ejs',{list})
}))

////create route
app.post('/listings',wrapasync(async(req,res,next)=>{
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
        res.redirect('/listings');
}))

////edit route
app.get('/listings/:id/edit',validateListing,wrapasync(async (req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    res.render('./listings/edit.ejs',{listing});
}))

////update
app.put('/listings/:id',validateListing,wrapasync(async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)
}))

////delete route
app.delete('/listings/:id',wrapasync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect('/listings');
}))

app.all('*',(req,res,next)=>{
    return next(new ExpressError(404,"Page Not Found!!"))
})

app.use((err,req,res,next)=>{
    let {status=500,message="Something Went Wrong"}=err;
    res.status(status).render('./listings/error.ejs',{err});
    // res.status(status).send(message);
})

app.listen(8080,()=>{
    console.log("App is listening at port 8080")
}) 