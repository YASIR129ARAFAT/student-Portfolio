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
const db = require("../database/db");
router2.get("/login", (req, res) => {
  res.render("login", {
    message: req.flash("message")
  });
});


// for rendering the main login page after user sign in (user landing page)
router2.get("/user_land", middlewares.verifyUser, async (req, res) => {
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

// for getting data of name, dept, description, links of user for user_landing_page
router2.get("/get_data2", middlewares.verifyUser, (req, res, next) => {
  try {
    var id = req.query.id;
    var sql = `select * from student_data t1, description t2, links t3 where t1.enroll_no = t2.enroll_no and t2.enroll_no = t3.enroll_no and t1.enroll_no = "${req.user.enroll_no}"`;
    con.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
        //console.log("i m in ");

        console.log(result)
        res.json(result);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});



router2.post("/login", (req, res) => {
  //  console.log(userkiId);

  var user = req.body.custid;
  if (user.length == 0) {
    req.flash("message", "please enter  custid");
    res.redirect("login");
  } else {
    var pass = req.body.password;

    var sql = `select * from student_data where enroll_no="${user}"`;

    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);

        console.log("username password doesnot matched");
        req.flash("message", "username and password does not match");
        res.redirect("login");
      } else {
        if (result.length == 0) {
          req.flash("message", "please enter  valid enroll no");
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
              .cookie("access_token", token, {
                httpOnly: true
              })
              .redirect("user_land");
            console.log("login successful")
            // res.send("successfully registered");
          } else {

            console.log("username or password doesnot matched");
            global_enroll = user;
            req.flash("message", "please enter valid password");
            res.redirect("login");
          }
        }
      }
    });
  }
});


router2.get('/adminForgotPassword', (req, res) => {
  res.render("adminForgotPassword");
})


//////

router2.get('/toggleShow', middlewares.verifyUser, (req, res) => {
  var id = req.query.id;
  var value = req.query.value;
  console.log(id);
  console.log(value);
  if (value === 'hide') {
    var sql = `update non_academic_achievements set hide='not_hide' where enrolment_no='${req.user.enroll_no}' and id=${id}`;
    db.query(sql, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        res.redirect('/api/nonacademicauth/student_non_academic_skill');
      }
    })
  }
  else{
    var sql = `update non_academic_achievements set hide='hide' where enrolment_no='${req.user.enroll_no}' and id=${id}`;
    db.query(sql, (error, result) => {
      if (error) {
        console.log(error)
      } else {
        res.redirect('/api/nonacademicauth/student_non_academic_skill');
      }
    })
  }
})
/////

module.exports = {
  router2,
  global_enrollment
};