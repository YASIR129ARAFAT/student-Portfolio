const express = require("express");
var con = require("../database/db");
//const middlewares = require("../utils/verifyUser.js");
var store = require("store-js");
const router = express.Router();
const middlewares = require("../utils/verifyUser.js");

router.get("/student_achievement", middlewares.verifyUser, async (req, res) => {
  try {
    

    var sql = `SELECT * FROM academic_achievements where enrolment_no="${req.user.enroll_no}" `;
    con.query(sql, (err, result) => {
      if (err) {
        res.render("student_achievement");
      } else {
        res.render("student_achievement", {
          skills: result,
          
        });
      }
    });
  } catch (error) {
    if (error) {
      // console.log(error);
    }
  }
});

router.get("/deleteAcadSkill", async (req, res) => {
  try {
    var id = req.query.id;
    var sql = `DELETE FROM academic_achievements where id=?`;
    con.query(sql, [id], (error, result) => {
      if (error) {
        // console.log(error);
        res.redirect("student_achievement");
      } else {
        res.redirect("student_achievement");
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router.post("/updateProjects", (req, res, next) => {
  var projectDes = req.body.skillDescription;
  var projecttitle = req.body.skillTitle;
  var id = req.query.id;
  //console.log(id + "update");

  var sql = `update   academic_achievements set skillTitle="${projecttitle}",  skillDescription="${projectDes}"    where id=?`;
  con.query(sql, [id], function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_achievement");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.redirect("student_achievement");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});



router.get("/get_data", (req, res, next) => {
  try {
    var id = req.query.id;
    console.log(id) + "hello";

    var sql = `SELECT * FROM academic_achievements where id=?`;
    con.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
        // console.log(result);

        res.json(result);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router.get("/get_data2", middlewares.verifyUser, (req, res, next) => {
  try {
    var id = req.query.id;

    var sql = `SELECT * FROM  academic_achievements where enrolment_no="${req.user.enroll_no}"  `;
    con.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
        //   console.log("pa");
        //    console.log(result);

        res.json(result);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router.post("/add_project", middlewares.verifyUser, (req, res, next) => {
  //console.log(data);

  var title = req.body.skillTitle;
  var projectDes = req.body.skillDescription;

  // var enroll=req.body.enrolment_no;

  //console.log(global.global_enrollment);
  //var enr = store.get("global_enrollment");
  //console.log(enr);

  var sql = `insert into academic_achievements  (skillTitle,skillDescription , enrolment_no, isVerified) values ( "${title}","${projectDes}","${req.user.enroll_no}", ${1})`;
  con.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_achievement");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.redirect("student_achievement");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});


router.get("/admin_student_achievement", middlewares.verifyUser, async (req, res) => {
  try {


    var sql = `SELECT * FROM academic_achievements where enrolment_no="${req.user.enroll_no}" `;
    con.query(sql, (err, result) => {
      if (err) {
        res.render("adminStudentAchievementView");
      } else {
        res.render("adminStudentAchievementView", {
          skills: result,
        });
      }
    });
  } catch (error) {
    if (error) {
      // console.log(error);
    }
  }
});

module.exports = router;