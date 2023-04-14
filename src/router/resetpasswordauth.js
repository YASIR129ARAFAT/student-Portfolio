const express = require("express");
var con = require("../database/db");
const middlewares = require("../utils/verifyUser.js");
var store = require("store-js");
const router = express.Router();




router.get("/reset-password2", (req, res) => {
  res.render("reset-password2");
});

router.post("/newPassword", middlewares.verifyUser, async (req, res) => {
  var oldPassword = req.body.oldpassword;
  var newPassword1 = req.body.password;

  try {
   

    var sql = `SELECT password FROM student_data where enroll_no="${req.user.enroll_no}" `;
    con.query(sql, (error, result) => {
      if (error){
            console.log("Wrong old password")

            res.render("reset-password2");
      }
      else {
          if(result[0].password!=oldPassword){
            console.log("wrong password")
            res.render("reset-password2")
          }
    var sql1 = `update student_data set password="${newPassword1}" where enroll_no="${req.user.enroll_no}" `;
  con.query(sql1, (err, result1) => {
      if(err){

            res.render("reset-password2");
      }
      else{
           res.render("homepage");
         
      }
  });
        
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});



module.exports=router;

