const express = require("express");
var db = require("../database/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const transport = require("../mailer/mailsend");
const JWT_SECRET = "parwez";

var enroll_no;

var Name;

var city;
var email;
var mobNo;
var occ ;
var dob ;
var pass;
//route 1
//register user

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

    console.log("hello");

   var sql = `INSERT INTO student_data VALUES ("${city}", "${email}" ,  "${mobNo}" , "${occ}" , '${dob}' , "${pass}", "${Name}","${enroll_no}");`;
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
