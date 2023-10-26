const express = require('express');
const router = express.Router();
const api = require('./Controller')
const middleware = require('./Middleware')
router.get('/data',middleware.verifyJWT,(req,res)=>{
    res.end();
})
router.get('/visitdata/:email',api.getvisitdata)
router.get('/mycourses/:name/:topic',api.allvideo)
router.post('/name',api.visit)
router.get('/:token',api.getcourse)
router.post('/mycourse',api.course)
router.post('/signup',api.signup)
router.post('/login',api.login)

router.post('/order',api.order);
router.post('/verify',api.verify)

module.exports = router;