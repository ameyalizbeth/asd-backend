
const express= require('express');
const fs= require('fs');
const path= require('path');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');
const Op=Sequelize.Op;
const sequelize = require('./util/database');
const app = express();
const jwt = require('jsonwebtoken');
const admin = require('./models/admin');
const student = require('./models/student');
const result = require('./models/result');
const course = require('./models/course');
const studentcourse = require('./models/student-course');
const notification = require('./models/notification');
const multer = require('multer');
const readXlsxFile = require("read-excel-file/node");
const bcrypt = require('bcrypt');
const certificate = require('./models/certificates');


var Storagecerti = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'certificates');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
    }
  });
  const fileFiltercerti=(req,file,cb)=>{
    console.log("yess");
    console.log(file);
    if(file.mimetype == 'application/pdf'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }

}
   





















const filestorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        
        cb(null, new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
    }
});
const fileFilter=(req,file,cb)=>{
    if(file.mimetype == 'image/jpg' || file.mimetype =='image/png' || file.mimetype =='image/jpeg'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }

}

const excelFilter = (req, file, cb) => {
    console.log(file);
    if (
      file.mimetype.includes("excel") ||
      file.mimetype.includes("spreadsheetml") ||
      file.mimetype.includes("application/octet-stream") 
    
    ) {
      cb(null, true);
    } else {
      cb("Please upload only excel file.", false);
    }
  };
  const  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'results');
    },
    filename: (req, file, cb) => {

      console.log(file.originalname);
      cb(null, new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname);
      
    },
  });

const isAuth = require('./middleware/is-auth');
admin.hasMany(notification);
notification.belongsTo(admin,{constraints:true,onDelete:'CASCADE'});

student.hasMany(studentcourse);
studentcourse.belongsTo(student,{constraints:true,onDelete:'CASCADE'});
studentcourse.belongsTo(course,{constraints:true,onDelete:'CASCADE'});



student.hasMany(certificate);
certificate.belongsTo(student,{constraints:true,onDelete:'CASCADE'});

const studentroutes = require('./routes/student');
// app.use(bodyparser.urlencoded({extended:true}));

app.use(bodyparser.json());



app.use('/certi',multer({storage:Storagecerti,fileFilter:fileFiltercerti}).single('certificatedata'));
app.use('/certificates',express.static(path.join(__dirname,'certificates')));

app.use('/images',express.static(path.join(__dirname,'images')));
// app.use('/images',express.static(path.join(__dirname,'results')));
app.use('/result',multer({storage:storage,fileFilter:excelFilter}).single('resultdata'));
app.use('/dp',multer({storage:filestorage,fileFilter:fileFilter}).single('data'));
admin.create({email:'admin@gmail.com',name:'ADMIN1',username:'TVE01',password:'TVE01'}).then(r=>console.log(r)).catch(err=>console.log(err));

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");

    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();

});
   
app.use('/student',studentroutes);
app.get('/admin/:adminid',isAuth,(req,res,next)=>{

    admin.findByPk(req.params.adminid).then(user=>{
        res.status(200).json({name:user.name,email:user.email,path:user.image,phone:user.phone,department:user.department,dob:user.dob});
    }).catch(err=>{ err.statusCode = 500;
        err.message = "error occured";
        next(err);})

});




app.post('/admin/:adminid/update',isAuth,(req,res,next)=>{
    admin.findByPk(req.params.adminid).then(user=>{
        user.update({name:req.body.name,email:req.body.email,department:req.body.department,dob:req.body.dob,phone:req.body.phone}).then(r=>{
            console.log("sucess");
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



app.post('/admin/:adminid/changepassword',isAuth,(req,res,next)=>{
    admin.findByPk(req.params.adminid).then(user=>{
        console.log(req.body.password);
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

app.post('/dp/admin/:adminid/images',isAuth,(req,res,next)=>{
    admin.findByPk(req.params.adminid).then(user=>{
        const p = user.image;
        console.log(req.file);
        user.update({image:req.file.path}).then(r=>{
            res.status(200).json({path:req.file.path});
//             if(p){
//             fs.unlink(p,function (err){
//                 if(err) throw err;
//                 console.log('file deleted');
//         })}


        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        }) ;
        
       
           
        }
       
       
    ).catch(err=>{ 
        err.statusCode = 500;
        err.message = "error occured";
        next(err);})



    console.log(req.file);

});



app.post('/dp/student/:studentid/images',isAuth,(req,res,next)=>{
    student.findByPk(req.params.studentid).then(user=>{
        const p = user.image;
        console.log(p);
        console.log(req.file);
        user.update({image:req.file.path}).then(r=>{
            res.status(200).json({path:req.file.path});
//             if(p){
//             fs.unlink(p,function (err){
//                 if(err) throw err;
//                 console.log('file deleted');
//         })}


        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        }) ;
        
       
           
        }
       
       
    ).catch(err=>{ 
        err.statusCode = 500;
        err.message = "error occured";
        next(err);})



    console.log(req.file);

});

app.post('/result/admin/:adminid/results',isAuth,async(req,res,next)=>{
    try{
        console.log(req.file);
        console.log(req.body);
        if (req.file == undefined) {
                return res.status(400).send("Please upload an excel file!");
            }
            // console.log(req.file);
        
            readXlsxFile('./results/'+req.file.filename).then((rows) => {
                // skip header
                rows.shift();
          
                let results = [];
          
                rows.forEach((row) => {
                  let result = {
                   
                    
                    username:row[1],
                    courseid:row[2],
                    coursename:row[3],
                    semester:row[4],
                    department:row[5],
                    grade:row[6],
                    year:row[7],
                    monthandyear:row[8],
                    credit:row[9],
                    gpa:row[10],
                   
                  };
          
                  results.push(result);
                });
                result.findAll({where:{year:req.body.year,semester:req.body.sem}}).then(r=>{
                    console.log(r.length);
                    if(r.length==0){
                        result.bulkCreate(results)
                        .then((r) => {
                          //   console.log(r);
                          res.status(200).send({
                            message: "Uploaded the file successfully: " + req.file.originalname,
                          });
                        })
                        .catch((error) => {
                          //   console.log(error);
                          res.status(500).send({
                            message: "Fail to import data into database!",
                            error: error.message,
                          });
                        });
                    }
                    else{
                        res.status(403).send("already published results");
                    }

                }).catch(err=>{
                    err.statusCode = 500;
                    err.message = "error occured";
                    next(err);
                });
                
              });
            
            
        } catch(error){
                
            res.status(500).send({
                message: "could not upload file",
                error: error.message,
              });
        
        }   

    });


app.post('/result/admin/:adminid/updateresults',isAuth,async(req,res,next)=>{
    try{
        if (req.file == undefined) {
                return res.status(400).send("Please upload an excel file!");
            }
            console.log(req);
        
            readXlsxFile('./results/'+req.file.filename).then((rows) => {
                // skip header
                rows.shift();
          
                let results = [];
          
                rows.forEach((row) => {
                  let result = {
                   
                    
                    username:row[1],
                    courseid:row[2],
                    coursename:row[3],
                    semester:row[4],
                    department:row[5],
                    grade:row[6],
                    year:row[7],
                    monthandyear:row[8],
                    credit:row[9],
                    gpa:row[10],
                   
                  };
          
                  results.push(result);
                });
                results.map(r=>{
                    result.update(
                        {grade:r.grade,gpa:r.gpa},
                        {where:{username:r.username,courseid:r.courseid,coursename:r.coursename,semester:r.semester,year:r.year},
                        returning:true,plain:true})
                       .then(r=>{
                                console.log("succesfull");
                            })
                            .catch(err=>{
                                console.log(err);
                            })

                    })

                    result.update({gpa:r.gpa},{where:{username:r.username,semester:r.semester,year:r.year},returning:true,plain:true}).then(r=>{
                        console.log("succesfull");
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                }).catch(err=>{
                            console.log(err);
                            res.status(500).send({
                                      message: "Fail to import data into database!",
                                      error: error.message,
                                    });
                        });
                
                // // result.bulkCreate(results)
                // //   .then((r) => {
                // //       console.log(r);
                // //     res.status(200).send({
                // //       message: "Uploaded the file successfully: " + req.file.originalname,
                // //     });
                // //   })
                // //   .catch((error) => {
                // //       console.log(error);
                // //     res.status(500).send({
                // //       message: "Fail to import data into database!",
                // //       error: error.message,
                // //     });
                //   });
              
            } catch (error) {
              console.log(error);
              res.status(500).send({
                message: "Could not upload the file: " + req.file.originalname,
              });
            }
        
            

});


app.get('/courses',isAuth,(req,res,next)=>{
    const courses=[];
    course.findAll().then(course=>{
        course.map(e=>{
            courses.push(e.dataValues);
 
        })
        res.status(200).json({courses:courses});
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
        

});

app.get('/students',isAuth,(req,res,next)=>{
    const username=[];
    student.findAll().then(student=>{
        student.map(e=>{
            username.push(e.dataValues.username);
 
        })
        res.status(200).json({username:username});
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
        

});
app.post('/students',isAuth,(req,res,next)=>{
    const username = req.body.username;
    const semester =req.body.semester;
    const department=req.body.department;
    const students=[];

    if(semester == '' && department == ''){
        student.findAll({where:{username:username}}).then(student=>{
            // console.log(student);
            student.map(e=>{
                // console.log(e);
                students.push(e.dataValues);
     
            })
            res.status(200).json({students:students});
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        });
            

    }
    else if(semester=='' && username == ''){
        student.findAll({where:{department:department}}).then(student=>{
            // console.log(student);
            student.map(e=>{
                // console.log(e);
                students.push(e.dataValues);
     
            })
            res.status(200).json({students:students});
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        });

    }
    else if(username=='' && department==''){
        student.findAll({where:{currentsem:semester}}).then(student=>{
            // console.log(student);
            student.map(e=>{
                // console.log(e);
                students.push(e.dataValues);
     
            })
            res.status(200).json({students:students});
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        });

    }
    else if(semester==''){
        student.findAll({where:{username:username,department:department}}).then(student=>{
            // console.log(student);
            student.map(e=>{
                // console.log(e);
                students.push(e.dataValues);
     
            })
            res.status(200).json({students:students});
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        });

    }
    else if(username==''){
        student.findAll({where:{currentsem:semester,department:department}}).then(student=>{
            // console.log(student);
            student.map(e=>{
                // console.log(e);
                students.push(e.dataValues);
     
            })
            res.status(200).json({students:students});
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        });
    }
    else if(department==''){
        student.findAll({where:{currentsem:semester,username:username}}).then(student=>{
            // console.log(student);
            student.map(e=>{
                // console.log(e);
                students.push(e.dataValues);
     
            })
            res.status(200).json({students:students});
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        });
    }
    else{
   
    student.findAll({where:{username:req.body.username,currentsem:req.body.semester,department:req.body.department}}).then(student=>{
        // console.log(student);
        student.map(e=>{
            // console.log(e);
            students.push(e.dataValues);
 
        })
        res.status(200).json({students:students});
    }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
    });
        
}
});


app.post('/register',isAuth,async(req,res,next)=>{
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(req.body.password,salt);
const name = req.body.name;
const email = req.body.email;
const username = req.body.username;

const currentsem = req.body.currentsem;
const department = req.body.department;

if(req.body.currentuser === req.userid){
student.create({name:name,email:email,username:username,password:hashedpassword,currentsem:currentsem,department:department}).then(r=>res.status(200).json({message:"registered succesfully"})).catch(err=>{
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
      err.message = "course already registered";
      next(err);
    })}
    else{
        const error =new Error('NOT AUTHENTICATED');
        error.statusCode = 401;
        throw error;
    }
    
    });
app.post('/login',(req,res,next)=>{
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
                   {expiresIn:'4h'});
               
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
                    bcrypt.compare(password,user.password).then(ismatch=>{
                        console.log(ismatch);
                        if(ismatch){
                            const token = jwt.sign(
                                {
                                    userid:loadeduser.username
             
                                },
                                'somesupersecretsecre',
                                {expiresIn:'4h'});
                            
                          res.status(200).json({token:token,userid:loadeduser.username,status:status});

                        }
                        else{
                            res.status(401).send({status:401});
                

                        }
                    }).catch(err=>{
                        err.statusCode = 500;
                err.message = "internal server error";
                console.log(err);
                next(err);

                    })
        
                      
        
                   }
               
                else{
               res.status(404).send({status:404});
                }
            }).catch(err=>{
                
            })
           }
        }).catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
        })
    // res.send(`hello${username}`);
});

app.post('/notification',isAuth,(req,res,next)=>{
notification.create({header:req.body.header,body:req.body.body,adminUsername:req.userid}).then(r=>{
    console.log(r);
    res.status(200).send();
}).catch(err=>{ err.statusCode = 500;
    err.message = "couldnt create notification";
    next(err);})

});
app.get('/notification',(req,res,next)=>{
    const notifications = [];
    notification.findAll()
    .then(notification=>{
        console.log(notification)
        notification.map(e=>{
            notifications.push(e.dataValues);
        })
        res.status(200).json({notifications:notifications});

    }
    ).catch(err=>{ err.statusCode = 500;
        err.message = "error occured";
        next(err);})
    
    });




    app.get('/notifications',(req,res,next)=>{
        const notifications = [];
        
        
      notification.count().then(r=>{
          console.log(r);
        if(r>5){
            notification.findAll({where:{id:{
                [Op.in]:[r,r-1,r-2,r-3,r-4]
            }}}).then(notification=>{
                console.log(notification)
                notification.map(e=>{
                    notifications.push(e.dataValues);
                })
                res.status(200).json({notifications:notifications});
        
            }).catch(err=>{ err.statusCode = 500;
                err.message = "error occured";
                next(err);})
    
        }
        else{
            notification.findAll()
            .then(notification=>{
                console.log(notification)
                notification.map(e=>{
                    notifications.push(e.dataValues);
                })
                res.status(200).json({notifications:notifications});
        
            }).catch(err=>{
                err.statusCode = 500;
                err.message = "error in finding notification";
                next(err);
            })
    

        }
       

      }).catch(err=>{
        err.statusCode = 500;
        err.message = "error occured";
        next(err);
      });
       
       
        });





        app.post("/certi/student/:studentid/uploadcertificates",isAuth,(req,res,next)=>{
            console.log(req.file);
            console.log(req.body.title);
            if(!req.file){
              res.sendStatus(422);
            }
            else if (req.userid===req.params.studentid){
              certificate.create({username:req.userid,title:req.body.title,category:req.body.category,filepath:req.file.path});
              res.sendStatus(200);
            }
           else
           res.sendStatus(401);
            
            
            
          });




          app.get("/certificates/admin/:adminid/:studentid/viewcertificates",isAuth,(req,res,next)=>{
  
            const certificates=[];
          
            if (req.userid===req.params.adminid){
              
              certificate.findAll({where:{username:req.params.studentid}}).then(result=>{
                
                result.map(e=>{
                  certificates.push(e.dataValues);
                })
               
                // res.status(200).json({certificates});
                res.status(200).json(certificates);
              }).catch(err=>console.log(err));
              
          
            }
           else
           res.sendStatus(401);
            
            
            
          })
        
        
        
          app.get("/certificates/admin/:adminid/:studentid/viewcertificates/:certificateid",isAuth,(req,res,next)=>{
          
          
            console.log("individual certificate route reached");
            console.log(req.params.certificateid);
            let filep="";
            if (req.userid===req.params.adminid){
                 certificate.findByPk(req.params.certificateid).then(result=>{
                  //  res.status(200).json({link:result.filepath});
                  filep=result.filepath;
                  // filep="http://localhost:9000/" + filep;
                  console.log(filep);
                  
                  res.status(200).json({link:`https://student-info-backend.herokuapp.com/${filep}`});
                 }).catch(err=>console.log(err));
            }
            else
              res.sendStatus(401);
              
          
            
            
            
          })
        





          app.get("/certificates/student/:studentid/viewcertificates",isAuth,(req,res,next)=>{
  
            const certificates=[];
          
            if (req.userid===req.params.studentid){
              
              certificate.findAll({where:{username:req.params.studentid}}).then(result=>{
                
                result.map(e=>{
                  certificates.push(e.dataValues);
                })
               
                // res.status(200).json({certificates});
                res.status(200).json(certificates);
              }).catch(err=>console.log(err));
              
          
            }
           else
           res.sendStatus(401);
            
            
            
          })
        
        
        
          app.get("/certificates/student/:studentid/viewcertificates/:certificateid",isAuth,(req,res,next)=>{
          
          
            console.log("individual certificate route reached");
            console.log(req.params.certificateid);
            let filep="";
            if (req.userid===req.params.studentid){
                 certificate.findByPk(req.params.certificateid).then(result=>{
                  //  res.status(200).json({link:result.filepath});
                  filep=result.filepath;
                  // filep="http://localhost:9000/" + filep;
                  console.log(filep);
                  
                  res.status(200).json({link:`https://student-info-backend.herokuapp.com/${filep}`});
                 }).catch(err=>console.log(err));
            }
            else
              res.sendStatus(401);
              
          
            
            
            
          })
app.post('/admin/:adminid/:studentid/updatecertificate/:certificateid',isAuth,(req,res,next)=>{
    if(req.userid === req.params.adminid){
        certificate.findByPk(req.params.certificateid)
        .then(r=>{
            r.update({points:req.body.points,comments:req.body.comments}).then(r=>{
                res.sendStatus(200);
                console.log("succes");
            }).catch(err=>{
                err.statusCode = 500;
                err.message = "error occured";
                next(err);
        
            })
        })
        .catch(err=>{
            err.statusCode = 500;
            err.message = "error occured";
            next(err);
    
        });

    }
    else{
        
        res.sendStatus(401);
    }
})

app.use((error,req,res,next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).send();
    console.log(status);
});




sequelize.sync().then(r=>{
    // console.log(r);
    app.listen(process.env.PORT || 3000);
}).catch(err=>console.log(err));

