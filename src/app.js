const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "parwez";
const transport = require("../src/mailer/mailsend");
var db = require("../src/database/db");
require("./auth");


var userkiId;
var genereted_account_no;
var password_from_database;
var email_from_database;
var enrollment;

var session = require("express-session");
var flush = require("connect-flash");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { constants } = require("buffer");
const passport = require("passport");
const { profile } = require("console");

//path set up
const staticpath = path.join(__dirname, "../public");
const partialpath = path.join(__dirname, "../templates/partials");
const templatepath = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);
var global_enroll;

app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flush());
const port = 80; //IF PROCESS.ENV NOT AVAILABLE THEN GOES ON 3000

app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

//////////////////////////////////////////////////////////////
//google authentication
function isloggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

//google authenticate
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/student_profile",
    failureRedirect: "/auth/failure",
  })
);
//github authenticate
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["email", "profile"] })
);
app.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/homepage",
    failureRedirect: "/auth/failure",
  })
);

// facebook authenticate

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email", "profile"] })
);
app.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/homepage",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("something went wrong");
});
app.get("/protected", isloggedIn, (req, res) => {
  res.send(`hello ${req.user.email}`);
});
app.get("/logout", (req, res) => {
  req.logOut();
  req.session.destroy();
  res.render("homepage");
});

///////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
app.get("/register", (req, res) => {
  res.render("register", { message: req.flash("message") });
});

// student personal details
app.get("/student_data", (req, res) => {
  res.render("student_data");

});





//render login page
app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});
app.get("/homepage", isloggedIn, (req, res) => {
  var profile_pic;
  if (req.user.picture == null) {
    profile_pic = req.user.photos[0].value;
  } else {
    profile_pic = req.user.picture;
  }
  console.log(profile_pic);

  res.render("homepage", { email: req.user.email, picture: profile_pic });
});
app.get("/home2", (req, res) => {
  res.render("home2", { message: req.flash("message") });
});
app.get("/congrats_message", (req, res) => {
  res.render("congrats_message", {
    genereted_account_no: genereted_account_no,
  });
});

// forgot passwords
//using router file
app.use("/api/projectauth", require("./router/projectauth"));
app.use("/api/auth", require("./router/auth"));
app.use("/api/registerauth", require("./router/registerauth"));








////////

//post request on login

app.post("/login", async (req, res) => {
  console.log(userkiId);
  
  var user = req.body.custid;
  if (user.length == 0) {
    req.flash("message", "please enter  custid");
    res.redirect("login");
  } else {
    var pass = req.body.password;
    console.log(user + " " + pass);
    
    var sql = `select   password from student_data where enroll_no="${user}"`;
    
    db.query(sql, function (err, result) {
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
            res.render('student_profile')
            // res.send("successfully registered");
          } else {
            console.log("username or password doesnot matched");
            global_enroll=user;
            req.flash("message", {
              email: '1',
              picture: profile_pic,
            });
            res.redirect("login");
          }
        }
      }
    });
  }
});

//////////////////////////////////////////////////////////////////////////////////////
app.get("/student_profile", (req, res) => {
  res.render("student_profile");
});
app.get("/student_achievement", (req, res) => {
  res.render("student_achievement");
});

app.get("/student_cgpa", (req, res) => {
  res.render("student_cgpa");
});

app.get("/student_non_academic_skill", (req, res) => {
  res.render("student_non_academic_skill");
});












app.listen(port, () => {
  console.log(`listening to ${port} `);
});
