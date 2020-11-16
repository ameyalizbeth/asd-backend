const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const course = sequelize.define('course',{
    courseid :{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    coursename:{
        type:Sequelize.STRING,
        allowNull:false

    },
    credit :{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    staff:{
        type:Sequelize.STRING,
        allowNull:true

    },
    semester:{
        type:Sequelize.STRING,
        allowNull:false

    }
});

module.exports=course;