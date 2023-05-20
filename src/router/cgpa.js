const express = require("express");
var con = require("../database/db");
const router = express.Router();
const middlewares = require("../utils/verifyUser.js");
//to render project page

router.get("/cgpa", middlewares.verifyUser, async (req, res) => {
  try {
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

    con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
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
        con.query(sql, (err, result) => {
          if (err) {
            console.log(err, "2");
          } else {
            sem1 = result;
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
            con.query(sql, (err, result) => {
              if (err) {
                console.log(err, "3");
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
                con.query(sql, (err, result) => {
                  if (err) {
                    console.log(err, "3");
                  } else {
                    sem4 = result;
                    //calculating avg cgpa
                    console.log(sem4);
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
                    con.query(sql, (err, result) => {
                      if (err) {
                        console.log(err, "3");
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
                        con.query(sql, (err, result) => {
                          if (err) {
                            console.log(error, "3");
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
                            con.query(sql, (err, result) => {
                              if (err) {
                                console.log(error, "3");
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
                                con.query(sql, (err, result) => {
                                  if (err) {
                                    console.log(err, "3");
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
                                    console.log(Enroll);
                                    //overall cgpa
                                    overallAvg /= totalCredits;
                                    overallAvg = overallAvg.toFixed(2);

                                    res.render("cgpa", {
                                      Enroll: Enroll,
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
      }
    });
  } catch (error) {
    if (error) {
      console.log(error, "4fses");
    }
  }
});

//add grades
router.get("/addGrades", async (req, res) => {
  res.render("addGrades");
});

router.post("/addGrades", middlewares.verifyUser, async (req, res) => {
  try {
    // console.log('posted');
    // console.log(req.body)


    var semester = req.body.semester; //as string
    var numSubjects = parseInt(req.body.num_subjects); //as string but parsed to int
    var enrollment = req.user.enroll_no;
    console.log(enrollment);

    var subjects = [];

    // console.log(enrollment)
    // Collect data for each subject
    if (numSubjects === 1) {
      // console.log('jjjjhhhtt')
      var sub = req.body.sub;
      var subcode = req.body.subcode;
      var cgpa = req.body.cgpa;
      var credits = parseFloat(req.body.credits); //as string but parsed to float

      subjects.push({
        sub,
        subcode,
        cgpa,
        credits,
      });
    } else {
      for (let i = 0; i < numSubjects; i++) {
        var sub = req.body.sub[i];
        var subcode = req.body.subcode[i];
        var cgpa = parseFloat(req.body.cgpa[i]);
        var credits = req.body.credits[i];

        subjects.push({
          sub,
          subcode,
          cgpa,
          credits,
        });
      }
    }

    // console.log("subjects", subjects);

    var tableName = "sem" + semester.toString(); //this is the name of table where we need to insert our data
    console.log(tableName);
    // console.log(subjects[0].subcode);

    for (let i = 0; i < subjects.length; i++) {
      //adding it to database
      var sql = `INSERT INTO ${tableName} values(?,?,?,?,?)`;
      var values = [
        subjects[i].subcode,
        subjects[i].sub,
        subjects[i].cgpa,
        enrollment,
        subjects[i].credits,
      ];
      //  console.log(values);
      con.query(sql, values, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          //do nothing
        }
      });
    }
    res.redirect("/api/cgpa/adminCgpa");

  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

//delete grade

router.get("/deleteGrade", async (req, res) => {
  try {
    var flag_edit = 1;
    var SEM = req.query.semester;
    console.log(SEM);
    var tableName = "sem" + SEM.toString();
    console.log(tableName);
    var enrollment_no = req.query.enrollment_no;
    console.log(enrollment_no);
    var sql = `DELETE FROM ${tableName} WHERE enrollment_no='${enrollment_no}'`;
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("/api/cgpa/adminCgpa");
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router.get("/editGrade", async (req, res) => {
  try {
    var flag = req.query.flag;
    var enrollment_no = req.query.enrollment_no;
    var semester = req.query.semester;
    var tableName = "sem" + semester.toString();
    console.log(tableName);
    var sql = `select * from ${tableName} where enrollment_no='${enrollment_no}'`;
    con.query(sql, (error, result) => {
      if (error) console.log(error);

      console.log(result);
      res.render("editGrades", {
        result,
        flag,
        enrollment_no,
        noOfCourses: result.length,
        semester,
      });
    });
  } catch (error) {
    if (error) console.log(error);
  }
});


router.post("/postEditedGrades", async (req, res) => {
  try {
    console.log("ndsos")
    var semester = req.body.semester; //as string but parsed to int
    console.log(semester);
    var numSubjects = parseInt(req.body.noOfCourses); //as string but parsed to int
    var enrollment = req.body.enrollment_no;
    var subjects = [];

    console.log(enrollment);
    // Collect data for each subject
    if (numSubjects === 1) {
      var sub = req.body.courseName;
      var subcode = req.body.subCode;
      var cgpa = req.body.cgpa;
      var credits = parseFloat(req.body.credits); //as string but parsed to float

      subjects.push({
        sub,
        subcode,
        cgpa,
        credits,
      });
    } else {
      for (let i = 0; i < numSubjects; i++) {
        var sub = req.body.courseName[i];
        var subcode = req.body.subCode[i];
        var cgpa = parseFloat(req.body.cgpa[i]);
        var credits = req.body.credits[i];

        subjects.push({
          sub,
          subcode,
          cgpa,
          credits,
        });
      }
    }

    // console.log("subjects", subjects);

    var tableName = "sem" + semester; //this is the name of table where we need to insert our data
    for (let i = 0; i < subjects.length; i++) {
      //adding it to database
      var sql = `UPDATE ${tableName} SET courseName='${subjects[i].sub}', credits=${subjects[i].credits}, cgpa=${subjects[i].cgpa} WHERE enrollment_no='${enrollment}'and courseId='${subjects[i].subcode}'`;
      con.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("hello")
        }
      });
    }

    res.redirect("/api/cgpa/adminCgpa");
    // console.log(`Received data: semester=${semester}, num_subjects=${numSubjects}, subjects=${subjects[0].credits}`);
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router.get("/adminCgpa", middlewares.verifyUser, async (req, res) => {
  try {

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

    con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
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
        con.query(sql, (err, result) => {
          if (err) {
            console.log(err, "2");
          } else {
            sem1 = result;
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
            con.query(sql, (err, result) => {
              if (err) {
                console.log(err, "3");
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
                con.query(sql, (err, result) => {
                  if (err) {
                    console.log(err, "3");
                  } else {
                    sem4 = result;
                    //calculating avg cgpa
                    console.log(sem4);
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
                    con.query(sql, (err, result) => {
                      if (err) {
                        console.log(err, "3");
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
                        con.query(sql, (err, result) => {
                          if (err) {
                            console.log(error, "3");
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
                            con.query(sql, (err, result) => {
                              if (err) {
                                console.log(error, "3");
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
                                con.query(sql, (err, result) => {
                                  if (err) {
                                    console.log(err, "3");
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
                                    console.log(Enroll);
                                    //overall cgpa
                                    overallAvg /= totalCredits;
                                    overallAvg = overallAvg.toFixed(2);

                                    res.render("adminCgpaView", {
                                      Enroll: Enroll,
                                      overallAvg,

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
      }
    });
  } catch (error) {
    if (error) {
      console.log(error, "4fses");
    }
  }
});


module.exports = router;