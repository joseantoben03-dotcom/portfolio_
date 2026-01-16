const mongoose = require("mongoose");
const express = require("express");
const router=require("./route/user")
const cors=require("cors")
require("dotenv").config();

const app = express();
app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected successfully to db"))
  .catch((err) => console.log(err));
  

app.use('/', router)
module.exports=app;