const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("./models/mydb");
const app = express();
const jwt = require('jsonwebtoken');
const userModel = require("./models/user");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const middleware = {
     verifyJWT: async (req, res, next) => {
     
         const token = req.headers["mytoken"];
       
       
        if (!token) {
            res.json('NOT LOGIN')
        } else {
            jwt.verify(token, "Coding-learner9580", async(err, decoded) => {
                if (err) {
                    console.log(err);
                   res.send('Login again')
                } else {
                             let mydata = await userModel.findOne({email:decoded.email});
                  req.body = mydata;
                   
                  
                    res.json({
                      name:mydata.name,
                      course:mydata.courses,
                      
                    })
                    next();
                  
                }
                
            });
           
        }
       
      }
     
}
module.exports = middleware;