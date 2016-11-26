var mysql = require("mysql");
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
  router.get("/users/:user_id",function(req,res){
      var query = "SELECT * FROM ?? WHERE ??=?";
      var table = ["user","id",req.params.user_id];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
              res.json({"Error" : false, "Message" : "Success", "Users" : rows});
          }
      });
  });
}

module.exports = REST_ROUTER;
