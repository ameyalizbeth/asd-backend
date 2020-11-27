const express= require('express');
const isAuth = require('../middleware/is-auth');
const student = require('../models/student');
const studentcourse = require('../models/student-course');
const course = require('../models/course');
const routes = express.Router();



routes.get('/:studentid',isAuth,(req,res)=>{

    student.findByPk(req.params.studentid).then(user=>{
        res.status(200).json({name:user.name,email:user.email});
    })

});

routes.get('/:studentid/registercourses/:sem',isAuth,(req,res)=>{
    const courses = [];
    const scourse = [];

    studentcourse.findAll({where: {semester:req.params.sem,studentUsername:req.params.studentid}}).then(studcourse=>{
       
        if(studcourse.length==0){
            course.findAll({where: {semester:req.params.sem}}).then(course=>{
                course.map(e=>{
                    courses.push(e.dataValues);
         
                })
                res.status(200).json({courses:courses});
            }).catch(err=>console.log(err));

        }
        else{
            studcourse.map(e=>{scourse.push(e.dataValues);})
            console.log(scourse);
            res.status(200).json({scourse:scourse});


        }

    }).catch(err=>console.log(err));
   

});


routes.post('/student-registered-courses',isAuth,(req,res)=>{
const courses = req.body.courses;
    console.log(req.body.semester);
    console.log(courses);
var coursename;
courses.map(e=>{
    console.log(e);
    course.findByPk(e).then(course=>{
         coursename = course.coursename;
        console.log(coursename);
         studentcourse.create({semester:req.body.semester,coursename:coursename,studentUsername:req.body.username,courseCourseid:e}).then(r=>{
        res.status(200).send();
    }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
   
});


});




module.exports= routes;
