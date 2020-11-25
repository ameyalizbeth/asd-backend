const Sequelize = require('sequelize');
const sequelize = new Sequelize('heroku_03d8274e8f9bdb1','bf018a30bc2b87','8ac61902',{dialect:'mysql',host:'us-cdbr-east-02.cleardb.com'});

module.exports=sequelize;
