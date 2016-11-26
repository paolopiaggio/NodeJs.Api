var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./rest.js");
var Sequelize = require('sequelize');
var app  = express();

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var sequelize = new Sequelize('nodejsApiDB', 'local', 'local', {
        host: '192.168.50.10',
        dialect: 'mysql',
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        logging: null,//console.log,
        define: {
            timestamps: false
        }
    });

    var User = sequelize.define('users', {
        username: Sequelize.STRING,
    });

    sequelize
      .authenticate()
      .then(function(err) {
        console.log('Connection has been established successfully.');
        self.configureExpress(User);
      })
      .catch(function (err) {
        console.log('Unable to connect to the database:', err);
        self.stop(err);
      });

}

REST.prototype.configureExpress = function(user) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,user,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();
