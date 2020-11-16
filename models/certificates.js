const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const certificates = sequelize.define('certificate',{
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
    title: {
        type:Sequelize.STRING,
        allowNull:false


    },
    points: {
        type:Sequelize.INTEGER,
        allowNull:true
    },
    comments: {
        type:Sequelize.STRING,
        allowNull:true


    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports=certificates;