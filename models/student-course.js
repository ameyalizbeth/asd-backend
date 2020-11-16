const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const studentcourse = sequelize.define('studentcourse',{
    id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
        

    },
   
    semester: {
        type:Sequelize.STRING,
        allowNull:false

    },
    
    coursename: {
        type:Sequelize.STRING,
        allowNull:false

    }
});

module.exports=studentcourse;