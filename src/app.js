const express = require("express");
const app = express();
const hbs = require("hbs");
const ejs = require("ejs");
const path = require("path");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "parwez";
const transport = require("../src/mailer/mailsend");
var db = require("../src/database/db");
require("./auth");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

var global_enrollment;

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
app.get("/landing", (req, res) => {
  res.render("landing");
});



//render login page

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
const {router2} = require('./router/loginauth.js')
app.use("/api/projectauth", require("./router/projectauth"));
app.use("/api/auth", require("./router/auth"));
app.use("/api/registerauth", require("./router/registerauth"));
app.use("/api/nonacademicauth", require("./router/nonacademicauth"));
app.use("/api/cgpa", require("./router/cgpa"));
app.use("/api/achievementsauth", require("./router/achievementsauth"));
app.use("/api/loginauth", router2);
app.use("/api/resetpasswordauth", require("./router/resetpasswordauth"));
app.use("/api/adminRegisterAuth", require("./router/adminRegisterAuth"));
app.use("/api/studentProfileAuth", require("./router/studentProfileAuth"));
//post request on login


//////////////////////////////////////////////////////////////////////////////////////
app.get("/student_profile", (req, res) => {
  res.render("student_profile");
});









app.listen(port, () => {
  console.log(`listening to ${port} `);
});
// module.exports.global_enrollment=global_enrollment;



