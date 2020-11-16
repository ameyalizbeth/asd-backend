const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const result = sequelize.define('result',{
    id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        

    },
    username: {
        type:Sequelize.STRING,
        allowNull:false
    },
    courseid: {
        type:Sequelize.STRING,
        allowNull:false

    },
    semester: {
        type:Sequelize.INTEGER,
        allowNull:false

    },
    marks: {
        type:Sequelize.FLOAT,
        allowNull:false


    },
    department:{
        type:Sequelize.STRING,
        allowNull:false


    }
});

module.exports= result;