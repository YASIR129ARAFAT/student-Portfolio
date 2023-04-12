var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcd1234",
  database: "se_project",
});

    db.connect(function (err) {
      if (err) {
        console.log("some error ");
      } else {
        console.log("connected");
      }
    });



module.exports=db;

