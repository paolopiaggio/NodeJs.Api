var mysql = require("mysql");
function REST_ROUTER(router,user,md5) {
    var self = this;
    self.handleRoutes(router,user,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,user,md5) {
  router.get("/users/:user_id",function(req,res){
    user.findById(req.params.user_id)
      .then(function (user) {
        res.json({"Error" : false, "Message" : "Success", "User" : user});
      })
      .catch(function (err){
        res.json({"Error" : true, "Message" : "Error record not found"});
      });
  });
}

module.exports = REST_ROUTER;
