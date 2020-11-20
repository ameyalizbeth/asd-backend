const Sequelize = require('sequelize');
const sequelize = new Sequelize('heroku_cbf970c362cb60e','bb38a1704471bf','8518b9e7',{dialect:'mysql',host:'us-cdbr-east-02.cleardb.com'});


module.exports=sequelize;