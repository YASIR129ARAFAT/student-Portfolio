var createError = require("http-errors");
var session = require("express-session");
var flash = require("connect-flash");
var express = require("express");
var logger = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var db = require("../database/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const CryptoJS = require("crypto-js");
const key = "12345";



var logged_email;

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



router.get("/login_admin", (req, res) => {
  res.render("login_admin", { message: req.flash("messages") });
});

router.get("/change_password", (req, res) => {
  res.render("change_password");
});



router.get("/admin_add_new_user", (req, res) => {
  res.render("admin_add_new_user");
});

router.get("/admin_home", (req, res) => {
  var query = `SELECT * FROM student_data;`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    // Render the HTML template with the customer details
    const record = results;
    // console.log(record)
    res.render("admin_home", { record });
  });
  // res.render('admin_home');
});

router.get("/admin_home", (req, res) => {
  var query = `SELECT * FROM student_data;`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    // Render the HTML template with the customer details
    const record = results;
    // console.log(record)
    res.render("admin_home", { record });
  });
  // res.render('admin_home');
});

router.post("/logout", function (req, res, next) {
  // If the user is loggedin
  if (req.session.loggedin) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect("login_admin");
  } else {
    // Not logged in
    res.redirect("login_admin");
  }
});

router.post("/register", function (req, res, next) {
  var email = req.body.email;
  var name = req.body.fullName;
 // var username = req.body.Username;
  var pass = req.body.Password;
  var cipher = crypt.encrypt(pass);

  console.log(name);
  var sql = `INSERT INTO admin values ("${email}", "${name}",  "${cipher}");`;
  db.query(sql, function (err, result) {
    if (err) {
      alert("email exists");
      throw err;
    }

    console.log("Row has been updated");
    res.redirect("login_admin");
  });
});

router.post("/login", async (req, res) => {
  email = req.body.email;
  if (email.length == 0) {
    req.flash("success", "Please enter valid Username");
    console.log("enter email");
    res.redirect("login_admin");
  } else {
    var pass = req.body.Password;

    var sql = `select name, password from admin where email="${email}"`;

    db.query(sql, function (err, result) {
      if (err) {
        console.log(err);

        console.log("email password doesnot matched");
        //   req.flash('success', "username and password does not match");
        // alert("user pass not match")
        res.redirect("login_admin");
      } else {
        console.log(result);

        if (result.length == 0) {
          // req.flash('success', "please enter valid password");
          res.redirect("login_admin");

        } else {
          let gg = crypt.decrypt(result[0].password);
          if (gg.localeCompare(pass) == 0) {
            var kk = result[0].fname;
            gname = kk;
            logged_email = email;
            res.render("admin_home");
            console.log("success")
          } else {
            console.log("email or Password doesnot matched");
            //   req.flash('success', "Username and Password does not match");
            res.redirect("login_admin");
          }
        }
      }
    });
  }
});

router.post("/new_user_admin", function (req, res, next) {
  var roll = req.body.rollno;
  var name = req.body.Name;
  var address = req.body.address;
  var email = req.body.Email;
  var mobile = req.body.mobileno;
  var dob = req.body.dob;
  var program = req.body.program;
  var dept = req.body.dept;
  var year = req.body.year;
  var sem = req.body.Semester;

  var sql = `insert into student_data values ("${roll}", "${name}", "${address}", "${email}", "${mobile}", '${dob}', "${roll}", "${program}", "${dept}", "${year}", "${sem}");`;
  db.query(sql, function (err, result) {
    if (err) throw err;

    console.log("Row has been updated");
    res.redirect("admin_add_new_user");
  });
});

router.get("/search/:key", function (req, res, next) {
  var query;
  if (req.params.key.length != 0)
    query = `SELECT * FROM student_data where name like "%${req.params.key}%";`;
  else query = `SELECT * FROM student_data;`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    // Render the HTML template with the customer details
    const record = results;
  res.json(results);

  });
});

router.post("/delete", function (req, res, next) {
  // console.log(req.body.del)
  var query = `delete from student_data where enroll_no = "${req.body.del}";`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    // Render the HTML template with the customer details
    res.redirect("admin_home");
  });
});

router.post("/reset_pass", function (req, res, next) {
  // If the user is loggedin
  console.log(logged_email);
  var sql = `select password from admin where email="${logged_email}";`;

  var old_password_entered = req.body.old_password;
  db.query(sql, function (err, result) {
    if (err) throw err;

    if (crypt.decrypt(result[0].password) != old_password_entered) {
      console.log("old password doesn't match");
      res.redirect("change_password");
    } else {
      // Not logged in
      var new_pass = crypt.encrypt(req.body.confirm_password);
      console.log(new_pass);

      var sql1 = `update admin set password ="${new_pass}" where email="${logged_email}";`;
      db.query(sql1, function (err1, result1) {
        if (err1) throw err1;
        else {
          console.log(result1);
          console.log("updated");
          res.redirect("admin_home");
        }
      });
    }
  });
});

router.post("/checkemail", (req, res) => {
  const email = req.body.email;
  console.log("helooooooo");
  console.log(email);
  // Check if the email already exists in the database
  // pool.query("SELECT COUNT(*) AS count FROM admin WHERE email = ?", [email], (error, results, fields) => {
  //   if (error) throw error;

  //   if (results[0].count > 0) {
  //     // Email already exists
  //     res.json({ exists: true });
  //   } else {
  //     // Email does not exist
  //     res.json({ exists: false });
  //   }
  // });
  var query = `SELECT COUNT(*) AS count FROM admin WHERE email = "${email};"`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    if (results[0].count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});


router.get("/get_data2", (req, res, next) => {
  try {
    var id = req.query.id;

    var sql = `SELECT * FROM student_data `;
    db.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
        console.log(result);

        res.json(result);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});
router.get("/details/:key", (req, res, next) => {
  try {
    console.log("hello");
    var id = req.params.key;

    var sql = `SELECT * FROM student_data where enroll_no = '${id}'`;
    db.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
     //   console.log("i m in")
      //  console.log(result);
       // req.user=result;

       //  console.log(req.user+" "+"users");
       
            let token = jwt.sign(result[0], "parwez");
            res
              .cookie("access_token", token, { httpOnly: true })
              .render("student_profile");
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});





module.exports=router;