const express= require('express');
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const app = express();
const jwt = require('jsonwebtoken');
const admin = require('./models/admin');
const student = require('./models/student');
const course = require('./models/course');
const studentcourse = require('./models/student-course');

const isAuth = require('./middleware/is-auth');

student.hasMany(studentcourse);
studentcourse.belongsTo(student,{constraints:true,onDelete:'CASCADE'});
studentcourse.belongsTo(course,{constraints:true,onDelete:'CASCADE'});


const studentroutes = require('./routes/student');
// app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());

// admin.create({email:'sreelal@gmail.com',name:'sreelal',username:'TVE01',password:'sreelal'}).then(r=>console.log(r)).catch(err=>console.log(err));

app.use(function(req,res,next){
    res.header("Acess-Control-Allow-Origin","*");
    res.header("Acess-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");

    res.header("Acess-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();

});
   
app.use('/student',studentroutes);
app.get('/admin/:adminid',isAuth,(req,res)=>{

    admin.findByPk(req.params.adminid).then(user=>{
        res.status(200).json({name:user.name,email:user.email});
    }).catch(err=>{console.log(err)})

});
app.get('/courses',isAuth,(req,res)=>{
    const courses=[];
    course.findAll().then(course=>{
        course.map(e=>{
            courses.push(e.dataValues);
 
        })
        res.status(200).json({courses:courses});
    }).catch(err=>console.log(err));
        

});

app.get('/students',isAuth,(req,res)=>{
    const username=[];
    student.findAll().then(student=>{
        student.map(e=>{
            username.push(e.dataValues.username);
 
        })
        res.status(200).json({username:username});
    }).catch(err=>console.log(err));
        

});
app.post('/students',isAuth,(req,res)=>{
    // console.log(req.body.username);
    // console.log(req.body.semester);
    // console.log(req.body.department);
    const students=[];
    student.findAll({where:{username:req.body.username,currentsem:req.body.semester,department:req.body.department}}).then(student=>{
        // console.log(student);
        student.map(e=>{
            // console.log(e);
            students.push(e.dataValues);
 
        })
        res.status(200).json({students:students});
    }).catch(err=>console.log(err));
        

});


app.post('/register',isAuth,(req,res,next)=>{
const name = req.body.name;
const email = req.body.email;
const username = req.body.username;
const password = req.body.password;
const currentsem = req.body.currentsem;
const department = req.body.department;

if(req.body.currentuser === req.userid){
student.create({name:name,email:email,username:username,password:password,currentsem:currentsem,department:department}).then(r=>res.status(200).json({message:"registered succesfully"})).catch(err=>{
  err.statusCode = 403;
  err.message = "student already registered";
  next(err);
})}
else{
    const error =new Error('NOT AUTHENTICATED');
    error.statusCode = 401;
    throw error;
}

});

app.post('/registercourses',isAuth,(req,res,next)=>{
    const courseid = req.body.courseid;
    const coursename = req.body.coursename;
    const credit = req.body.credit;
    const staff = req.body.staff;
    const semester=req.body.semester;
    
    if(req.body.currentuser === req.userid){
    course.create({courseid:courseid,coursename:coursename,credit:credit,staff:staff,semester:semester}).then(r=>res.status(200).json({message:"registered succesfully"})).catch(err=>{
      err.statusCode = 403;
      err.message = "student already registered";
      next(err);
    })}
    else{
        const error =new Error('NOT AUTHENTICATED');
        error.statusCode = 401;
        throw error;
    }
    
    });
app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    // res.redirect('/');
    // console.log(`${username}`);
    // console.log(req.body);
   admin.findByPk(username).then(user=>
        {
            loadeduser=user;
            status='admin';
            if(user){
           if(user.password === password){

               const token = jwt.sign(
                   {
                       userid:loadeduser.username

                   },
                   'somesupersecretsecre',
                   {expiresIn:'2h'});
               
             res.status(200).json({token:token,userid:loadeduser.username,status:status});

           }
        else{
            res.status(401).send({status:401});
        }}
           else{
               student.findByPk(username).then(user=>
                {
                    loadeduser=user;
                    status = 'student';
                    if(user){
                   if(user.password === password){
        
                       const token = jwt.sign(
                           {
                               userid:loadeduser.username
        
                           },
                           'somesupersecretsecre',
                           {expiresIn:'2h'});
                       
                     res.status(200).json({token:token,userid:loadeduser.username,status:status});
        
                   }
                else{
                    res.status(401).send({status:401});
                }}
                else{
               res.status(404).send({status:404});
                }
            }).catch(err=>console.log(err))
           }
        }).catch(err=>console.log(err))
    // res.send(`hello${username}`);
});

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).send();
    console.log(status);
});
sequelize.sync().then(r=>{
    // console.log(r);
    app.listen(3000);
}).catch(err=>console.log(err));

