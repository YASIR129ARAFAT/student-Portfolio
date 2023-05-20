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

//for cookies
const middlewares = require("../utils/verifyUser.js");

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
  res.render("login_admin", {
    message: req.flash("message")
  });
});

router.get("/change_password", (req, res) => {
  res.render("change_password", {
    message: req.flash("message")
  });
});



router.get("/admin_add_new_user", (req, res) => {
  res.render("admin_add_new_user", {
    message: req.flash("message")
  });
});

router.get("/admin_home", middlewares.verifyUser, (req, res) => {
  var query = `SELECT * FROM student_data;`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    // Render the HTML template with the customer details
    const record = results;
    // console.log(record)

    try {
      console.log(req.user.email)
    } catch (error) {
      res.status(500).send("Sign in First")
    }
    res.render("admin_home", {
      record
    });
  });
  // res.render('admin_home');
});

router.get("/admin_home",middlewares.verifyUser, (req, res) => {
  var query = `SELECT * FROM student_data;`;
  db.query(query, function (error, results, fields) {
    if (error) throw error;
    // Render the HTML template with the customer details
    const record = results;
    // console.log(record)
    res.render("admin_home", {
      record
    });
  });
  // res.render('admin_home');
});

router.get("/logout", middlewares.verifyUser, async function (req, res, next) {
  console.log("trying logout")
  try {
    res.clearCookie('access_token');
    console.log("logout successfull")
    res.redirect("/landing");
    // res.end();
    // await req.user.save()
  } catch (error) {
    res.status(500).send("Some error logging out")
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
      req.flash("message", "Please enter valid email");
      res.redirect("login_admin");
      //   console.log(err);

    } else {
      //console.log("Row has been updated");
      req.flash("message", "Successfully Registered");
      res.redirect("login_admin");
    }
  });
});

router.post("/login", async (req, res) => {
  email = req.body.email;
  if (email.length == 0) {
    req.flash("message", " email already in use");
    res.redirect("login_admin");
    console.log("enter email");

  } else {
    var pass = req.body.Password;

    var sql = `select * from admin where email="${email}"`;

    db.query(sql, function (err, result) {
      if (err) {



        req.flash("message", "Please enter valid email");
        res.redirect("login_admin");
      } else {
        console.log(result);

        if (result.length == 0) {
          // req.flash('success', "please enter valid password");
          req.flash("message", "Please enter valid email");
          res.redirect("login_admin");
          //  res.redirect("login_admin");

        } else {
          let gg = crypt.decrypt(result[0].password);
          if (gg.localeCompare(pass) == 0) {
            var kk = result[0].fname;
            gname = kk;
            logged_email = email;
            let token = jwt.sign(result[0], "parwez");
            res
              .cookie("access_token", token, {
                httpOnly: true
              })
              .redirect("admin_home");
            // res.render("admin_home");

            console.log("success")
          } else {

            req.flash("message", "Incorrect password");
            res.redirect("login_admin");
            //   console.log("email or Password doesnot matched");
            //   req.flash('success', "Username and Password does not match");
            //res.redirect("login_admin");
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
  var cipher = crypt.encrypt(roll);

  var sql = `insert into student_data values ("${roll}", "${name}", "${address}", "${email}", "${mobile}", '${dob}', "${cipher}", "${program}", "${dept}", "${year}", "${sem}");`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("message", "enrollment already exist");
      res.redirect("/api/adminRegisterAuth/admin_add_new_user");
    } else {

      var sql = `insert into links values ("${roll}", "","","","", "");`
      db.query(sql, function (err, result) {
        if (err) {
          console.log(err)
          req.flash("message", "Registration unsuccessfull");
          res.redirect("register_comp")
        } else {

          var sql = `insert into description values ("${roll}", "")`;
          db.query(sql, function (err, result) {
            if (err) {
              console.log(err)
              req.flash("message", "Registration unsuccessfull");
              res.redirect("register_comp");
            } else {

              req.flash("message", "seccessfully registered");
              res.redirect("/api/adminRegisterAuth/admin_home");

            }
          });

        }
      });

    }
  });
});

router.get("/search/:key", middlewares.verifyUser, function (req, res, next) {
  var query;
  if (req.params.key.length != 0)
    query = `SELECT * FROM student_data where enroll_no like "%${req.params.key}%"`;
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
    if (err) {
      req.flash("message", "some error ");
      res.redirect("change_password");
    } else {
      console.log(result[0].password);

      if (crypt.decrypt(result[0].password) != old_password_entered) {
        req.flash("message", "old password not matched ");
        res.redirect("change_password");
      } else {
        // Not logged in
        var new_pass = crypt.encrypt(req.body.confirm_password);
        console.log(new_pass);

        var sql1 = `update admin set password ="${new_pass}" where email="${logged_email}";`;
        db.query(sql1, function (err1, result1) {
          if (err1) {
            req.flash("message", "some unknown error ");
            res.redirect("change_password");
          } else {
            //  console.log(result1);
            //  console.log("updated");
            req.flash("message", "successfully changed ");
            res.redirect("change_password");
          }
        });
      }
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
      res.json({
        exists: true
      });
    } else {
      res.json({
        exists: false
      });
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
        res.json(result);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});
router.get("/details/:key", middlewares.verifyUser, (req, res, next) => {
  try {
    // console.log("hello");
    var id = req.params.key;
    // console.log('hhh'+id);
    var flag_edit = req.query.flag_edit;


    var sql = `SELECT * FROM student_data where enroll_no = '${id}'`;
    db.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {



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

        var sql = `SELECT * FROM sem3 WHERE enrollment_no='${id}'`;

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

            var sql = `SELECT * FROM sem1 WHERE enrollment_no='${id}'`;
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

                var sql = `SELECT * FROM sem2 WHERE enrollment_no='${id}'`;
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

                    var sql = `SELECT * FROM sem4 WHERE enrollment_no='${id}'`;
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

                        var sql = `SELECT * FROM sem5 WHERE enrollment_no='${id}'`;
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

                            var sql = `SELECT * FROM sem6 WHERE enrollment_no='${id}'`;
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

                                var sql = `SELECT * FROM sem7 WHERE enrollment_no='${id}'`;
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

                                    var sql = `SELECT * FROM sem8 WHERE enrollment_no='${id}'`;
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
                                        var sql = `SELECT * FROM links WHERE enroll_no='${id}'`;
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
                                            let token = jwt.sign(result[0], "parwez");
                                            res.cookie("access_token", token, {
                                              httpOnly: true
                                            }).render("adminStudentProfile", {
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

        ///////


        //////
        
        // res
        //   .cookie("access_token", token, {
        //     httpOnly: true
        //   })
        //   .render("adminStudentProfile");
        // /////
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

module.exports = router;