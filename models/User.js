const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

// we are free to define our schema as we like but passport-local-mongoose by default add username and password (Even if we didn't mention it in schema) for us and it will also add hasn and salt field to store username,the hash password and salt value


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose) ////This will add username ,hash password,salting automatically for us and also some of its methods

module.exports=mongoose.model('User',userSchema);