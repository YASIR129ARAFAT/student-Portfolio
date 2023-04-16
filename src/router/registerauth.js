const express = require("express");
var db = require("../database/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const transport = require("../mailer/mailsend");
const JWT_SECRET = "parwez";
const CryptoJS = require("crypto-js");
const key = "12345";


var enroll_no;

var Name;

var city;
var email;
var mobNo;
var occ;
var dob;
var pass;
var dept;
var sem;

//route 1
//register user


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











router.get("/register", async (req, res, next) => {
  res.render("register", { message: req.flash("message") });
});
router.post("/register", async (req, res, next) => {
  enroll_no = req.body.customerId;

  Name = req.body.Name;

  city = req.body.city;
  email = req.body.email;
  mobNo = req.body.mobileNumber;
  occ = req.body.occupation;
  dob = req.body.dob;
  pass = req.body.password;
  dept = req.body.department;
  sem = req.body.semester


  const secret = JWT_SECRET + pass;
  const payload = {
    id: enroll_no,
    email: email,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const link = `http://localhost:80/api/registerauth/confirm_register/${enroll_no}/${token}`;
  console.log(email);
  var mailOptions = {
    from: "iit2021113@iiita.ac.in",
    to: `"${email}"`,
    subject: "confirm regiter",
    text: `confirm register link ===>${link}`,
  };
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("invalid email");
      // console.log(error);
      res.render("register");
    } else {
      console.log("email has been sent", info.response);
      req.flash("message", "Check Your Mail to confirm register");
      res.render("register");
    }
  });


});

// setting the new password

//route 2

router.get("/confirm_register/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
  // console.log(token);

  //  console.log(id);
  if (id != enroll_no) {
    res.send("invalid");
    return;
  }

  const secret = JWT_SECRET + pass;

  try {
    const payload = jwt.verify(token, secret);
    res.render("confirm_register", { id: id, token: token });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});


router.post("/confirm_register/:id/:token", async (req, res, next) => {
  const id = req.params.id;
  const token = req.params.token;

  const secret = JWT_SECRET + pass;
  try {
    //passwrod and confirm password should match
    // here we can simply find the user with the payload and finally update the passwrod
    //always hash the password;
    const payload = jwt.verify(token, secret);
    var cipher = crypt.encrypt(pass);
    console.log("hello");

    // var sql = `INSERT INTO student_data VALUES ("${city}", "${email}" ,  "${mobNo}" , "${occ}" , '${dob}' , "${cipher}", "${Name}","${enroll_no}" ,"${sem}", "${dept}" );`;
    var sql = `insert into student_data values ("${enroll_no}", "${Name}", "${city}", "${email}", "${mobNo}", '${dob}', "${cipher}", "${occ}", "${dept}", "2", "${sem}");`;
    db.query(sql, function (err, result) {
      if (err) {
        console.log(err)
        req.flash("message", "customer Id already exist");
        res.redirect("register");
      } else {

        console.log("Row has been updated");
        req.flash("message", "seccessfully registered");
        res.render("login");

      }
    });
  } catch (error) {
    console.log("ppask")
    console.log(error.message);
    res.send(error.message);
  }
});

module.exports = router;
