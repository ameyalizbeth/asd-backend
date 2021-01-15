const Sequelize = require('sequelize');
const sequelize = new Sequelize('heroku_a39ab545e43a14c','b5f224b260350d','73fc952a',{dialect:'mysql',host:'us-cdbr-east-03.cleardb.com'});

module.exports=sequelize;
