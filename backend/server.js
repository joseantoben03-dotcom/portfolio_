const mongoose = require("mongoose");
const express = require("express");
const router=require("./route/user")
const cors=require("cors")

const app = express();
app.use(cors());

app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1/portfolio")
  .then(() => console.log("Connected successfully to db"))
  .catch((err) => console.log(err));
  

app.use('/', router)
app.listen((3000),()=> console.log("Backend is running on Port 3000"));