const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./models/mydb");
const userModel = require("./models/user");
const cors = require("cors");
const app = express();
var bcrypt = require('bcryptjs');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//all middleware
app.get('/getall',async(req,res)=>{
    console.log('hello')
    let data = await userModel.find({});
    res.send(data);
})
app.delete('/delete',async(req,res)=>{
    let data = await userModel.deleteOne({email:"vicky@gmail.com"});
    res.send(data);
})
app.use('/allvideo',require("./Route"))
app.use('/home',require("./Route"))
app.use('/know',require("./Route"))
app.use('/course',require("./Route"))
app.use('/visit',require("./Route"))
app.use('/getcourse',require("./Route"))
app.use('/coding-learner-signup',require("./Route"))  //to sign up
app.use('/coding-learner-login',require("./Route"))  //to login
app.use("/razorpayorder", require("./Route")); //to order api
app.use("/razorpaypayment", require("./Route")); //to payment api
// app.use("/show", require("./Route")); //to show all data
app.use('/my',require("./Route"))

app.listen(5000);
console.log("Sever listen at port 5000");