const express = require("express");
var con = require("../database/db");

var store = require("store-js");
const router = express.Router();


router.get("/student_achievement", async (req, res) => {
  try {
    
    var sql = `SELECT * FROM academic_achievements `;
    con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("student_achievement", {
          skills: result,
        });
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});

router.get("/deleteAcadSkill", async (req, res) => {
  try {
    var id = req.query.id;
    var sql = `DELETE FROM academic_achievements where id=?`;
    con.query(sql, [id], (error, result) => {
      if (error) {
        console.log(error);
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



router.post("/add_project", (req, res, next) => {
  //console.log(data);

  var title = req.body.skillTitle;
  var projectDes = req.body.skillDescription;

  // var enroll=req.body.enrolment_no;

  //console.log(global.global_enrollment);
  var enr = store.get("global_enrollment");
  console.log(enr);

  var sql = `insert into academic_achievements  (skillTitle,skillDescription , enrolment_no, isVerified) values ( "${title}","${projectDes}",${enr}, ${1})`;
  con.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_achievement");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.render("student_achievement");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});


module.exports=router;
