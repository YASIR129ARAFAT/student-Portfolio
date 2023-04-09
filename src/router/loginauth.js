const express = require("express");
var con = require("../database/db");
const router = express.Router();
var global_enrollment;
var store=require('store-js');

var flash = require("connect-flash");
router.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});
router.post("/login", async (req, res) => {
//  console.log(userkiId);

  var user = req.body.custid;
  if (user.length == 0) {
    req.flash("message", "please enter  custid");
    res.redirect("login");
  } else {
    var pass = req.body.password;
    console.log(user + " " + pass);

    var sql = `select   password from student_data where enroll_no="${user}"`;

    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);

        console.log("username password doesnot matched");
        req.flash("message", "username and password does not match");
        res.redirect("login");
      } else {
        if (result.length == 0) {
          req.flash("message", "please enter valid password");
          res.redirect("login");
        } else {
          // console.log(result[0].password);
          let gg = result[0].password;
          console.log(gg);
          if (gg.localeCompare(pass) == 0) {
            var kk = result[0].fname;
            gname = kk;
            console.log(user + "hello");
             store.set("global_enrollment", `'${user}'`)
             global_enrollment=user;


            res.render("homepage");

            // res.send("successfully registered");
          } else {
            console.log("username or password doesnot matched");
            global_enroll = user;
            req.flash("message", {
              
            });
            res.redirect("login");
          }
        }
      }
    });
  }
});



module.exports=global_enrollment;
module.exports=router;














