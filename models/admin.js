const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const admin = sequelize.define('admin',{
    username: {
        type: Sequelize.STRING,
        allowNull:false,
        primaryKey:true,
        

    },
    password: {
        type:Sequelize.STRING,
        allowNull:false
    },
    dob:{
        type:Sequelize.DATEONLY,


    },
    department:{
        type:Sequelize.STRING,
    },
    phone:{
        type:Sequelize.STRING,
    },
    email: {
        type:Sequelize.STRING,

    },
    name: {
        type:Sequelize.STRING,
    },
    image:{
        type:Sequelize.STRING
    }
});


module.exports=admin;

