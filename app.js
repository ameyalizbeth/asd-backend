const express= require('express');
const bodyparser = require('body-parser');
const sequelize = require('./util/database');
const app = express();
const jwt = require('jsonwebtoken');
const admin = require('./models/admin');
const student = require('./models/student');
const isAuth = require('./middleware/is-auth');
// app.use(bodyparser.urlencoded({extended:true}));
// admin.create({email:'sreelal@gmail.com',name:'sreelal',username:'TVE01',password:'sreelal'}).then(r=>console.log(r)).catch(err=>console.log(err));

app.use(bodyparser.json());


app.use(function(req,res,next){
    res.header("Acess-Control-Allow-Origin","*");
    res.header("Acess-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");

    res.header("Acess-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();

});
app.get('/',(req,res,next)=>{
    res.send("ameya!!");
});

app.get('/admin/:adminid',isAuth,(req,res)=>{

    admin.findByPk(req.params.adminid).then(user=>{
        res.status(200).json({name:user.name,email:user.email});
    })

});
app.post('/register',isAuth,(req,res,next)=>{
const name = req.body.name;
const email = req.body.email;
const username = req.body.username;
const password = req.body.password;
const currentsem = req.body.currentsem;

if(req.body.currentuser === req.userid){
student.create({name:name,email:email,username:username,password:password,currentsem:currentsem}).then(r=>res.status(200).json({message:"registered succesfully"})).catch(err=>{
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
            if(user){
           if(user.password === password){

               const token = jwt.sign(
                   {
                       userid:loadeduser.username

                   },
                   'somesupersecretsecre',
                   {expiresIn:'2h'});
               
             res.status(200).json({token:token,userid:loadeduser.username});

           }
        else{
            res.status(401).send({status:401});
        }}
           else{
               res.status(404).send({status:404});
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

