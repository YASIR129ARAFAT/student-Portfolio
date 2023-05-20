const express = require("express");
var con = require("../database/db");
const middlewares = require("../utils/verifyUser.js");
var store = require("store-js");
const router = express.Router();
const CryptoJS = require("crypto-js");
const key = "12345";
var flash = require("connect-flash");

var crypt = {
  // (B1) THE SECRET KEY
  secret: "CIPHERKEY",

  // (B2) ENCRYPT
  encrypt: (clear) => {
    var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    return cipher.toString();
  },

  // (B3) DECRYPT
  decrypt: (cipher) => {
    var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    return decipher.toString(CryptoJS.enc.Utf8);
  },
};

router.get("/reset-password2",middlewares.verifyUser, (req, res) => {
  res.render("reset-password2", { message: req.flash("message") });
});

router.post("/newPassword", middlewares.verifyUser, async (req, res) => {
  var oldPassword = req.body.oldpassword;
  var newPassword1 = crypt.encrypt(req.body.password);

  try {


    var sql = `SELECT password FROM student_data where enroll_no="${req.user.enroll_no}" `;
    con.query(sql, (error, result) => {
      if (error) {
       req.flash("message", "please  correct password");
       res.redirect("reset-password2");
      }
      else {
        if (crypt.decrypt(result[0].password) != oldPassword) {
         // console.log("wrong password")
           req.flash("message", "Old password not correct");
           res.redirect("reset-password2");
        }
        else {
          var sql1 = `update student_data set password="${newPassword1}" where enroll_no="${req.user.enroll_no}" `;
          con.query(sql1, (err, result1) => {
            if (err) {

              req.flash("message", "password not changes");
              res.redirect("reset-password2");
            }
            else {
               req.flash("message", "password changed successfully");
               res.redirect("reset-password2");
             // res.render("user_land");
            }
          });
        }

      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

router.get("/adminResetPassword",(req,res)=>{
  var email = req.query.email;
  console.log(email);
  res.render("adminResetPassword",{email});
})


var crypt = {
  // (B1) THE SECRET KEY
  secret: "CIPHERKEY",

  // (B2) ENCRYPT
  encrypt: (clear) => {
    var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    return cipher.toString();
  },

  // (B3) DECRYPT
  decrypt: (cipher) => {
    var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    return decipher.toString(CryptoJS.enc.Utf8);
  },
};

router.post("/newAdminPassword",(req,res)=>{
  var email = req.query.email;
  console.log(email)
  var updatedPass = req.body.password;
  console.log(updatedPass)

  var cipher = crypt.encrypt(updatedPass)
   var sql  = `update admin set password='${cipher}' where email='${email}'`;
   con.query(sql,(error,result)=>{
    if(error){
      console.log(error)
    }
    else{
      res.redirect('/api/adminRegisterAuth/login_admin');
    }
   })
})
module.exports = router;

