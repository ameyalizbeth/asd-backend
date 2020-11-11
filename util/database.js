const Sequelize = require('sequelize');
const sequelize = new Sequelize('asd','root','ameya',{dialect:'mysql',host:'localhost'});


module.exports=sequelize;