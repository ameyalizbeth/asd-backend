const Sequelize = require('sequelize');
const sequelize = new Sequelize('heroku_a58b156ac875b24','ba5e1a571c373b','994e4e10',{dialect:'mysql',host:'us-cdbr-east-03.cleardb.com'});

module.exports=sequelize;
