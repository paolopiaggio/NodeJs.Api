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

function Context () {
    this.users;
    this.profiles;
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
        logging: console.log,
        define: {
            timestamps: false
        }
    });

    var User = sequelize.define('users', {
      id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
              len: 2
          }
      }
    });
    var Profile = sequelize.define('profiles', {
      id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
      },
      name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
              len: 4
          }
      },
      userId: {
          type: Sequelize.INTEGER,
          references: { model: "users", key: "id" },
          field: 'user_id'
        }
    });

    User.hasMany(Profile);
    Profile.belongsTo(User);

    var context = new Context();
    context.users = User;
    context.profiles = Profile;

    sequelize
      .authenticate()
      .then(function(err) {
        console.log('Connection has been established successfully.');
        self.configureExpress(context);
      })
      .catch(function (err) {
        console.log('Unable to connect to the database:', err);
        self.stop(err);
      });
}

REST.prototype.configureExpress = function(context) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,context,md5);
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
