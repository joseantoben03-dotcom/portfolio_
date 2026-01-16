const mongoose =require("mongoose");


const Userschema= new mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    message:String,
})

const User =mongoose.model('User',Userschema);

module.exports=User;