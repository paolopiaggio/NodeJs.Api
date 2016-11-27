var mysql = require("mysql");

function REST_ROUTER(router,user,md5) {
    var self = this;
    self.handleRoutes(router,user,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,userRepo,md5) {
  router.get("/users/:user_id",function(req,res){
      userRepo.findById(req.params.user_id)
        .then(function (user) {
          res.json({"Error" : false, "Message" : "Success", "User" : user});
        })
        .catch(function (err){
          res.status(404).json({"Error" : true, "Message" : "Error record not found"});
        });
  });

  router.get("/users",function(req,res){
      userRepo.findAll()
        .then(function (users) {
          res.json({"Error" : false, "Message" : "Success", "Users" : users});
        })
        .catch(function (err){
          res.status(500).json({"Error" : true, "Message" : "Error retrieving records"});
        });
  });

  router.post("/users",function(req,res){
      var userDto = req.body;
      if(!userDto.username)
      {
        res.status(400).json({"Error" : false, "Message" : "request not valid"});
        return;
      }
      var user = userRepo.build({username: userDto.username});
      user.save()
        .then(function(){
          res.json({"Error" : false, "Message" : `/users/${user.id}`, "User": user});
        })
        .catch(function(error) {
          res.status(500).json({"Error" : true, "Message" : "Error saving User"});
        })
    });

    router.put("/users",function(req,res){
        var userDto = req.body;
        if(!userDto.username || !userDto.id)
        {
          res.status(400).json({"Error" : false, "Message" : "request not valid"});
          return;
        }
        userRepo.findById(userDto.id)
          .then(function (user) {
            user.update({
                username: userDto.username
              })
              .then(function(){
                res.json({"Error" : false, "Message" : "Success", "User" : user});
              })
              .catch(function(error){
                res.status(500).json({"Error" : false, "Message" : "Error updating the record"});
              })
          })
          .catch(function (err){
            console.log(err);
            res.status(404).json({"Error" : true, "Message" : "Error record not found"});
          });
      });

      router.delete("/users/:user_id",function(req,res){
          userRepo.findById(req.params.user_id)
            .then(function (user) {
              user.destroy()
                .then(function(){
                  res.json({"Error" : false, "Message" : "Success"});
                })
                .catch(function(error){
                  res.status(500).json({"Error" : false, "Message" : "Error deleting the record"});
                })
            })
            .catch(function (err){
              console.log(err);
              res.status(404).json({"Error" : true, "Message" : "Error record not found"});
            });
        });
}

module.exports = REST_ROUTER;
