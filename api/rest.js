var mysql = require("mysql");
var simpleService = require('./services/simpleService.js');

function REST_ROUTER(router,context,md5) {
    var self = this;
    self.handleRoutes(router,context,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,context,md5) {
  router.get("/test/",function(req,res){
      res.json({"Error" : false, "Message" : "Success", "myName" : simpleService.getMyName()});
  });

  router.get("/users/:user_id",function(req,res){
      context.users.findById(req.params.user_id)
        .then(function (user) {
          res.json({"Error" : false, "Message" : "Success", "User" : user});
        })
        .catch(function (err){
          res.status(404).json({"Error" : true, "Message" : "Error user not found"});
        });
  });

  router.get("/users/:user_id/profiles",function(req,res){
      context.users.findById(req.params.user_id)
        .then(function (user) {
          user.getProfiles()
            .then(function(profiles){
              res.json({"Error" : false, "Message" : "Success", "Profiles" : profiles});
            })
            .catch(function(error){
              res.status(404).json({"Error" : true, "Message" : "Error profiles not found"});
            });
        })
        .catch(function (err){
          res.status(404).json({"Error" : true, "Message" : "Error user not found"});
        });
  });

  router.get("/profiles/",function(req,res){
      context.profiles.findAll({
          where: {
            userId: req.query.userId
          }
        })
        .then(function (profiles) {
          res.json({"Error" : false, "Message" : "Success", "Profiles" : profiles});
        })
        .catch(function(error){
          res.status(404).json({"Error" : true, "Message" : "Error profiles not found"});
        });
  });

  router.get("/users",function(req,res){
      context.users.findAll()
        .then(function (users) {
          res.json({"Error" : false, "Message" : "Success", "Users" : users});
        })
        .catch(function (err){
          res.status(500).json({"Error" : true, "Message" : "Error retrieving users"});
        });
  });

  router.post("/users",function(req,res){
      var userDto = req.body;
      if(!userDto.username)
      {
        res.status(400).json({"Error" : false, "Message" : "request not valid"});
        return;
      }
      var user = context.users.build({username: userDto.username});
      user.save()
        .then(function(){
          res.json({"Error" : false, "Message" : `/users/${user.id}`, "User": user});
        })
        .catch(function(error) {
          res.status(500).json({"Error" : true, "Message" : "Error saving user"});
        })
    });

    router.post("/profiles",function(req,res){
        var profileDto = req.body;
        if(!profileDto.name || !profileDto.userId)
        {
          res.status(400).json({"Error" : false, "Message" : "request not valid"});
          return;
        }
        var profile = context.profiles.build({name: profileDto.name, userId: profileDto.userId});
        profile.save()
          .then(function(){
            res.json({"Error" : false, "Message" : `/profiles/${profile.id}`, "Profile": profile});
          })
          .catch(function(error) {
            res.status(500).json({"Error" : true, "Message" : "Error saving profile"});
          })
      });

    router.put("/users",function(req,res){
        var userDto = req.body;
        if(!userDto.username || !userDto.id)
        {
          res.status(400).json({"Error" : false, "Message" : "request not valid"});
          return;
        }
        context.users.findById(userDto.id)
          .then(function (user) {
            user.update({
                username: userDto.username
              })
              .then(function(){
                res.json({"Error" : false, "Message" : "Success", "User" : user});
              })
              .catch(function(error){
                res.status(500).json({"Error" : false, "Message" : "Error updating the user"});
              })
          })
          .catch(function (err){
            console.log(err);
            res.status(404).json({"Error" : true, "Message" : "Error user not found"});
          });
      });

      router.delete("/users/:user_id",function(req,res){
          context.users.findById(req.params.user_id)
            .then(function (user) {
              user.destroy()
                .then(function(){
                  res.json({"Error" : false, "Message" : "Success"});
                })
                .catch(function(error){
                  res.status(500).json({"Error" : false, "Message" : "Error deleting the user"});
                })
            })
            .catch(function (err){
              console.log(err);
              res.status(404).json({"Error" : true, "Message" : "Error user not found"});
            });
        });
}

module.exports = REST_ROUTER;
