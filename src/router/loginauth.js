const express = require("express");
var con = require("../database/db");
const router2 = express.Router();
var global_enrollment;
var store = require("store-js");
const jwt = require("jsonwebtoken");

const CryptoJS = require("crypto-js");
const key = "12345";




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





 const middlewares = require("../utils/verifyUser.js");
var flash = require("connect-flash");
router2.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});


// for rendering the main login page after user sign in
router2.get("/user_land",middlewares.verifyUser, async (req, res) => {
  try {

        
    var sql = `SELECT * FROM student_data where enroll_no="${req.user.enroll_no}" `;
    con.query(sql, (error, result) => {
      if (error) console.log(error);
      else {
        res.render("user_land", {
          results: result
        });
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router2.post("/login",  (req, res) => {
  //  console.log(userkiId);

  var user = req.body.custid;
  if (user.length == 0) {
    req.flash("message", "please enter  custid");
    res.redirect("login");
  } else {
    var pass = req.body.password;

    var sql = `select   * from student_data where enroll_no="${user}"`;

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
          // req.user=result[0];
          // console.log(req.user);

          // console.log(result[0].password);
        //  let gg = result[0].password;
           let gg = crypt.decrypt(result[0].password);
          console.log(gg);
          if (gg.localeCompare(pass) == 0) {
            var kk = result[0].fname;
            gname = kk;
          //  console.log(user + "hello");
         //   store.set("global_enrollment", `'${user}'`);
         //   global_enrollment = user;

            let token = jwt.sign(result[0], "parwez");
            res
              .cookie("access_token", token, { httpOnly: true })
              .redirect("user_land");
              console.log("login successful")
            // res.send("successfully registered");
          } else {

            console.log("username or password doesnot matched");
            global_enroll = user;
            req.flash("message", {});
            res.redirect("login");
          }
        }
      }
    });
  }
});

module.exports = {  router2, global_enrollment };
