var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Parwez123@",
  database: "parwez",
});

    db.connect(function (err) {
      if (err) {
        console.log("some error ");
      } else {
        console.log("connected");
      }
    });



module.exports=db;

