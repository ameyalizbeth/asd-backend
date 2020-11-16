const express= require('express');
const isAuth = require('../middleware/is-auth');
const student = require('../models/student');
const routes = express.Router();



routes.get('/:studentid',isAuth,(req,res)=>{

    student.findByPk(req.params.studentid).then(user=>{
        res.status(200).json({name:user.name,email:user.email});
    })

});



module.exports= routes;