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
const middlewares = require("./utils/verifyUser.js");
var userkiId;
var genereted_account_no;
var password_from_database;
var email_from_database;
var enrollment;

var session = require("express-session");
var flush = require("connect-flash");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
  extended: true
}));
const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});
const {
  constants
} = require("buffer");
const passport = require("passport");
const {
  profile
} = require("console");

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

app.use(session({
  secret: "cats"
}));
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
  passport.authenticate("google", {
    scope: ["email", "profile"]
  })
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
  passport.authenticate("github", {
    scope: ["email", "profile"]
  })
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
  passport.authenticate("facebook", {
    scope: ["email", "profile"]
  })
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
  res.render("register", {
    message: req.flash("message")
  });
});

// student personal details
app.get("/student_data",middlewares.verifyUser, (req, res) => {

  var message = req.query.message;
  var sql =`select * from student_data where enroll_no='${req.user.enroll_no}'`
  db.query(sql,(error,result)=>{
    if(error){
      console.log(error,'jhsas');
    }
    else{

      res.render("student_data",{result,message});
    }
  })

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
  // console.log(profile_pic);

  res.render("homepage", {
    email: req.user.email,
    picture: profile_pic
  });
});
app.get("/home2", (req, res) => {
  res.render("home2", {
    message: req.flash("message")
  });
});
app.get("/congrats_message", (req, res) => {
  res.render("congrats_message", {
    genereted_account_no: genereted_account_no,
  });
});

// forgot passwords
//using router file
const {
  router2
} = require('./router/loginauth.js')
app.use("/api/projectauth", require("./router/projectauth"));
app.use("/api/linkauth", require("./router/linkauth"));
app.use("/api/auth", require("./router/auth"));
app.use("/api/registerauth", require("./router/registerauth"));
app.use("/api/nonacademicauth", require("./router/nonacademicauth"));
app.use("/api/cgpa", require("./router/cgpa"));
app.use("/api/achievementsauth", require("./router/achievementsauth"));
app.use("/api/loginauth", router2);
app.use("/api/resetpasswordauth", require("./router/resetpasswordauth"));
app.use("/api/adminRegisterAuth", require("./router/adminRegisterAuth"));
app.use("/api/studentProfileAuth", require("./router/studentProfileAuth"));
app.use("/api/searchedUser", require("./router/searchedUser"));
//post request on login


//////////////////////////////////////////////////////////////////////////////////////
app.get("/student_profile", middlewares.verifyUser, (req, res) => {
  var links;
  var sql = `SELECT * FROM links WHERE enroll_no='${req.user.enroll_no}'`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err)
    } else {

      links = result;
      console.log(result);
    }
  })
  //////

  var flag_edit = req.query.flag_edit;
  var sem1,
    sem2,
    sem3,
    sem4,
    sem5,
    sem6,
    sem7,
    sem8,
    overallAvg = 0.0,
    totalCredits = 0;

  var sql = `SELECT * FROM sem3 WHERE enrollment_no='${req.user.enroll_no}'`;

  db.query(sql, (err, result) => {
    if (err) {
      // console.log(err);
    } else {
      sem3 = result;
      //calculating avg cgpa
      var sem3avg = 0;
      var Credits = 0;
      for (var i = 0; i < sem3.length; ++i) {
        sem3avg += sem3[i].cgpa * sem3[i].credits;
        Credits += sem3[i].credits;
      }
      totalCredits += Credits;
      overallAvg += sem3avg;
      sem3avg /= Credits; //dividing by total no of subjects
      sem3avg = sem3avg.toFixed(2);

      var sql = `SELECT * FROM sem1 WHERE enrollment_no='${req.user.enroll_no}'`;
      db.query(sql, (err, result) => {
        if (err) {
          // console.log(err, "2");
        } else {
          sem1 = result;
          console.log("hhh:" + sem4);
          //calculating avg cgpa
          var sem1avg = 0;
          var Credits = 0;
          for (var i = 0; i < sem1.length; ++i) {
            sem1avg += sem1[i].cgpa * sem1[i].credits;
            Credits += sem1[i].credits;
          }
          totalCredits += Credits;
          overallAvg += sem1avg;
          sem1avg /= Credits; //dividing by total no of subjects
          sem1avg = sem1avg.toFixed(2);

          var sql = `SELECT * FROM sem2 WHERE enrollment_no='${req.user.enroll_no}'`;
          db.query(sql, (err, result) => {
            if (err) {
              // console.log(err, "3");
            } else {
              sem2 = result;
              //calculating avg cgpa
              var sem2avg = 0;
              var Credits = 0;
              for (var i = 0; i < sem2.length; ++i) {
                sem2avg += sem2[i].cgpa * sem2[i].credits;
                Credits += sem2[i].credits;
              }
              totalCredits += Credits;
              overallAvg += sem2avg;
              sem2avg /= Credits; //dividing by total no of subjects
              sem2avg = sem2avg.toFixed(2);

              var sql = `SELECT * FROM sem4 WHERE enrollment_no='${req.user.enroll_no}'`;
              db.query(sql, (err, result) => {
                if (err) {
                  // console.log(err, "3");
                } else {
                  sem4 = result;
                  //calculating avg cgpa
                  // console.log(sem4);
                  var sem4avg = 0;
                  var Credits = 0;
                  for (var i = 0; i < sem4.length; ++i) {
                    sem4avg += sem4[i].cgpa * sem4[i].credits;
                    Credits += sem4[i].credits;
                  }
                  totalCredits += Credits;
                  overallAvg += sem4avg;
                  sem4avg /= Credits; //dividing by total no of subjects
                  sem4avg = sem4avg.toFixed(2);

                  var sql = `SELECT * FROM sem5 WHERE enrollment_no='${req.user.enroll_no}'`;
                  db.query(sql, (err, result) => {
                    if (err) {
                      // console.log(err, "3");
                    } else {
                      sem5 = result;
                      //calculating avg cgpa
                      var sem5avg = 0;
                      var Credits = 0;
                      for (var i = 0; i < sem5.length; ++i) {
                        sem5avg += sem5[i].cgpa * sem5[i].credits;
                        Credits += sem5[i].credits;
                      }
                      totalCredits += Credits;
                      overallAvg += sem5avg;
                      sem5avg /= Credits; //dividing by total no of subjects
                      sem5avg = sem5avg.toFixed(2);

                      var sql = `SELECT * FROM sem6 WHERE enrollment_no='${req.user.enroll_no}'`;
                      db.query(sql, (err, result) => {
                        if (err) {
                          // console.log(err, "3");
                        } else {
                          sem6 = result;
                          //calculating avg cgpa
                          var sem6avg = 0;
                          var Credits = 0;
                          for (var i = 0; i < sem6.length; ++i) {
                            sem6avg += sem6[i].cgpa * sem6[i].credits;
                            Credits += sem6[i].credits;
                          }
                          totalCredits += Credits;
                          overallAvg += sem6avg;
                          sem6avg /= Credits; //dividing by total no of subjects
                          sem6avg = sem6avg.toFixed(2);

                          var sql = `SELECT * FROM sem7 WHERE enrollment_no='${req.user.enroll_no}'`;
                          db.query(sql, (err, result) => {
                            if (err) {
                              // console.log(err, "3");
                            } else {
                              sem7 = result;
                              //calculating avg cgpa
                              var sem7avg = 0;
                              var Credits = 0;
                              for (var i = 0; i < sem7.length; ++i) {
                                sem7avg += sem7[i].cgpa * sem7[i].credits;
                                Credits += sem7[i].credits;
                              }
                              totalCredits += Credits;
                              overallAvg += sem7avg;
                              sem7avg /= Credits; //dividing by total no of subjects
                              sem7avg = sem7avg.toFixed(2);

                              var sql = `SELECT * FROM sem8 WHERE enrollment_no='${req.user.enroll_no}'`;
                              db.query(sql, (err, result) => {
                                if (err) {
                                  // console.log(err, "3");
                                } else {
                                  sem8 = result;
                                  //calculating avg cgpa
                                  var sem8avg = 0;
                                  var Credits = 0;
                                  for (var i = 0; i < sem8.length; ++i) {
                                    sem8avg += sem8[i].cgpa * sem8[i].credits;
                                    Credits += sem8[i].credits;
                                  }
                                  totalCredits += Credits;
                                  overallAvg += sem8avg;
                                  sem8avg /= Credits; //dividing by total no of subjects
                                  sem8avg = sem8avg.toFixed(2);
                                  //get links from links table
                                  var links;
                                  var sql = `SELECT * FROM links WHERE enroll_no='${req.user.enroll_no}'`;
                                  db.query(sql, (err, result) => {
                                    if (err) {
                                      console.log(err)
                                    } else {
                                      links = result;
                                      console.log(links);

                                      let Enroll;
                                      if (sem1 && sem1.length > 0) {
                                        Enroll = sem1[0].enrollment_no;
                                      } else if (sem2 && sem2.length > 0) {
                                        Enroll = sem2[0].enrollment_no;
                                      } else if (sem3 && sem3.length > 0) {
                                        Enroll = sem3[0].enrollment_no;
                                      } else if (sem4 && sem4.length > 0) {
                                        Enroll = sem4[0].enrollment_no;
                                      } else if (sem5 && sem5.length > 0) {
                                        Enroll = sem5[0].enrollment_no;
                                      } else if (sem6 && sem6.length > 0) {
                                        Enroll = sem6[0].enrollment_no;
                                      } else if (sem7 && sem7.length > 0) {
                                        Enroll = sem7[0].enrollment_no;
                                      } else if (sem8 && sem8.length > 0) {
                                        Enroll = sem8[0].enrollment_no;
                                      }
                                      // console.log(Enroll);
                                      //overall cgpa
                                      overallAvg /= totalCredits;
                                      overallAvg = overallAvg.toFixed(2);
                                      console.log("Sem1: " + sem1);
                                      res.render("student_profile", {
                                        overallAvg,
                                        flag_edit,
                                        sem1: {
                                          sem1,
                                          avgCgpa: sem1avg,
                                        },
                                        sem2: {
                                          sem2,
                                          avgCgpa: sem2avg,
                                        },
                                        sem3: {
                                          sem3,
                                          avgCgpa: sem3avg,
                                        },
                                        sem4: {
                                          sem4,
                                          avgCgpa: sem4avg,
                                        },
                                        sem5: {
                                          sem5,
                                          avgCgpa: sem5avg,
                                        },
                                        sem6: {
                                          sem6,
                                          avgCgpa: sem5avg,
                                        },
                                        sem7: {
                                          sem7,
                                          avgCgpa: sem7avg,
                                        },
                                        sem8: {
                                          sem8,
                                          avgCgpa: sem8avg,
                                        },
                                        links,
                                      });
                                    }
                                  })
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });

 
});





app.listen(port, () => {
  // console.log(`listening to ${port} `);
});
// module.exports.global_enrollment=global_enrollment;