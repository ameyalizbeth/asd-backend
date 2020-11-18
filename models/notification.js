const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const notification = sequelize.define('notification',{
    id :{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    header:{
        type:Sequelize.STRING,
        allowNull:false

    },
   
    body:{
        type:Sequelize.STRING,
        allowNull:false

    },
    
});

module.exports=notification;