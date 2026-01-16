const express =require("express");
const router =express.Router();
const User = require("../model/user");

router.post("/message", async(req,res)=>{

    try{
    const {name,email,subject,message} =req.body;

    const newuser= new User({name:name,email:email,subject:subject,message:message});
    await newuser.save();
    res.json({message:"Message sent successfully"})
    }
    catch(err){
        res.json(err);
    }



})

module.exports=router