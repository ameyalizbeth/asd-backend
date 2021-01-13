const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const student = sequelize.define('student',{
    username: {
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
        

    },
    password: {
        type:Sequelize.STRING,
        allowNull:false
    },
    email: {
        type:Sequelize.STRING

    },
    name: {
        type:Sequelize.STRING,
    },
    department: {
        type:Sequelize.STRING,
    },
    currentsem: {
        type:Sequelize.STRING

    },
    dob:{
        type:Sequelize.DATE


    },
    phone:{
        type:Sequelize.STRING
    },
    
     image:{
            type:Sequelize.STRING
     }
    
});


module.exports=student;
