const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const result = sequelize.define('result',{
    id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
        

    },
    username: {
        type:Sequelize.STRING,
        allowNull:false
    },
    courseid: {
        type:Sequelize.STRING,
        allowNull:false

    },
    coursename:{
        type:Sequelize.STRING,
        allowNull:false
    },
    year:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    monthandyear:{
        type:Sequelize.STRING,
        allowNull:false

    },
    semester: {
        type:Sequelize.STRING,
        allowNull:false

    },
    grade: {
        type:Sequelize.STRING,
        allowNull:false


    },
    credit:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    gpa:{
        type:Sequelize.FLOAT,
        allowNull:false
    },
    department:{
        type:Sequelize.STRING,
        allowNull:false


    }
});




module.exports= result;
