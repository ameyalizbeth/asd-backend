const express= require('express');
const isAuth = require('../middleware/is-auth');
const student = require('../models/student');
const course = require('../models/course');
const routes = express.Router();



routes.get('/:studentid',isAuth,(req,res)=>{

    student.findByPk(req.params.studentid).then(user=>{
        res.status(200).json({name:user.name,email:user.email});
    })

});

routes.get('/:studentid/registercourses/:sem',isAuth,(req,res)=>{
    const courses = [];

   course.findAll({where: {semester:req.params.sem}}).then(course=>{
       course.map(e=>{
           courses.push(e.dataValues);

       })
       res.status(200).json({courses:courses});
   }).catch(err=>console.log(err));

});



module.exports= routes;