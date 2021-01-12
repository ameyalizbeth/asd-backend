const Sequelize = require('sequelize');
const sequelize = new Sequelize('heroku_aa73693d3864546','b906c041afc338','a9af9688',{dialect:'mysql',host:'us-cdbr-east-03.cleardb.com'});

module.exports=sequelize;
