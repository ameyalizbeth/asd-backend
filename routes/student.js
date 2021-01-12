const express= require('express');
const isAuth = require('../middleware/is-auth');
const student = require('../models/student');
const studentcourse = require('../models/student-course');
const course = require('../models/course');
const routes = express.Router();
const bcrypt = require('bcrypt');



routes.get('/:studentid',isAuth,(req,res,next)=>{

    student.findByPk(req.params.studentid).then(user=>{
        res.status(200).json({name:user.name,email:user.email});
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);

    })

});

routes.post('/:studentid/changepassword',isAuth,async(req,res,next)=>{
     const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(req.body.password,salt);
    student.findByPk(req.params.studentid).then(user=>{
        user.update({password:req.body.password}).then(r=>{
            res.status(200).send();
        }).catch(err=>{
            err.statusCode = 500;
        err.message = "error occured";
        next(err);
        })
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    })
})
routes.get('/:studentid/results/:sem',isAuth,(req,res,next)=>{
   const  results=[];
    result.findAll({where:{username:req.params.studentid,semester:req.params.sem}}).then(r=>{
        // console.log(r);
        r.map(e=>{
            results.push(e.dataValues);
        })
        res.status(200).json({results:results});
    })
    .catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
})

routes.get('/:studentid/registercourses/:sem',isAuth,(req,res,next)=>{
    const courses = [];
    const scourse = [];

    studentcourse.findAll({where: {semester:req.params.sem,studentUsername:req.params.studentid}}).then(studcourse=>{
        console.log((studcourse));
        if(studcourse.length==0){
            course.findAll({where: {semester:req.params.sem}}).then(course=>{
                course.map(e=>{
                    courses.push(e.dataValues);
         
                })
                res.status(200).json({courses:courses});
            }).catch(err=>{
                err.statusCode = 500;
        err.message = "error occured";
        next(err);
            });

        }
        else{
            studcourse.map(e=>{scourse,push(e.dataValues);})
            res.status(200).json({scourse:scourse});


        }

    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
   

   
});

routes.post('/student-registered-courses',isAuth,(req,res,next)=>{
const courses = req.body.courses;
console.log(courses);
var coursename;
courses.map(e=>{
    course.findByPk(e).then(course=>{
        console.log(e);
        console.log(course);
         coursename = course.coursename;
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
    studentcourse.create({coursename:coursename,courseCourseid:e,studentUsername:req.body.username,semester:req.body.semester}).then(r=>{
        res.status(200).send();
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
});


});


module.exports= routes;
