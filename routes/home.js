const express=require('express');
////Like we do urlecoded = true in app.js to get data from url//we have to do here mergeparams true so the data from app.js come here also
const router=express.Router({mergeParams:true});


router.get('/',(req,res)=>{
    res.render('./listings/home.ejs')
})

module.exports=router;