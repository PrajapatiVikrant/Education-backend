const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./models/mydb");
var crypto = require("crypto");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const userModel = require("./models/user");
const cors = require("cors");
const Razorpay = require("razorpay");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const key_id = "rzp_test_j9y9J7mpIATZVk";
const key_secret = "E0qcrngMstXWyv21bU4ANfW5";
const secretkey = "Coding-learner9580";
const api = {
  //sign up api
  signup: async function (req, res) {
    let data = await userModel.findOne({ email: req.query.email });
    if (!data) {
      console.log(req.query.password);
      const passwordhash = await bcrypt.hash(req.query.password, 10);
      const data = new userModel({
        name: req.query.name,
        email: req.query.email,
        password: passwordhash,
      });
      const result = await data.save();
      return res.send('success');
    } else {
      return res.send("user already exist");
    }
  },

  // login api
  login: async function (req, res) {
    let data = await userModel.findOne({ email: req.query.email });
    if (!data) {
      return res.send("Invalid detail");
    } else {
      const passwordmatch = await bcrypt.compare(
        req.query.password,
        data.password
      );
      if (passwordmatch === true) {
        const email = req.query.email;
        const password = req.query.password;
        const data = await jwt.sign(
          { email: email, password: password },
          secretkey,
          { expiresIn: "60m" }
        );
        return res.json({
          message: "login successfully",
          signature: data,
          email:email,
        });
        
      } else {
        return res.send({
          err: "wrong password",
          password: passwordmatch,
          right: data.password,
        });
      }
    }
  },

  //order api
  order: async function (req,res) {
  
         
    
          let instance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
          });
          let option = {
            amount: Number(req.body.amount) * 100,
            currency: "INR",
          };
          instance.orders.create(option, (err, order) => {
            if (err) {
              return res.send(err);
            } else {
           
              res.send(order);
            }
          });
        },

  //verify api
  verify: async function (req, res) {
    let body =
      req.body.response.razorpay_order_id +
      "|" +
      req.body.response.razorpay_payment_id;

    var expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === req.body.response.razorpay_signature) {
      res.send("sign valid");
    } else {
      res.send("sign invalid");
    }
  },
  course:async function(req,res){
    const name = req.query.name;
  
    jwt.verify(req.query.email, "Coding-learner9580", async(err, decoded) => {
          if (err) {
          
             res.send('Login again')
          } else {
                       
                       let mydata = await userModel.updateOne({email:decoded.email}, { $push: { courses:name } });
            req.body = mydata;
             
            
              res.json({
                name:mydata.name,
                course:mydata.courses,
                
              })
        
        }
      })
  },
  getcourse:async function(req,res){
   
    jwt.verify(req.params.token,'Coding-learner9580',async(err,decoded)=>{
      if (err) {
        console.log(err)
        return res.json({
          message:'Not login'
        })
      } else {
        const data = await userModel.findOne({email:decoded.email})
        const data1 = [];
        if(data){
        
          if(data.courses.length === 0){
           
            return res.json({
              message:'empty',
            })
          }else{
            return res.json({
              message:'success',
              course:data.courses
            })
          }
         
        }else{
          console.log('You are not register')
          return res.json({
            message:'You are not register'
          })
        }
        
      }
      })
    },
    getvisitdata:async function(req,res){
       let data = await userModel.findOne({email:req.params.email})
      
       res.send(data.visit)
    },
    allvideo:function(req,res){
     
    
    res.send(require('./'+req.params.name+'/'+req.params.topic));
    
    },
    visit:async function(req,res){
  
      jwt.verify(req.query.token,'Coding-learner9580',async(err,decoded)=>{
      if (err) {
       
        return res.json({
          message:'Not login'
        })
      } else {
        const data = await userModel.updateOne({email:decoded.email},{visit:req.query.name})
       
        if(data){
         
          return res.send('success')
        }else{
          return res.send('fail')
        }
        
          
        
      }
      })
     
    }
   
  
};
module.exports = api;
