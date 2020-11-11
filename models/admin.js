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
    email: {
        type:Sequelize.STRING

    },
    name: {
        type:Sequelize.STRING,
    }
});

module.exports=admin;

