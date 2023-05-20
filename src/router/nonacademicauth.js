const express = require("express");
var con = require("../database/db");
const router = express.Router();
var store = require("store-js");

const middlewares = require("../utils/verifyUser.js");
//to render project page
router.get("/student_non_academic_skill", middlewares.verifyUser, async (req, res) =>{
  try {
    var sql = `SELECT * FROM non_academic_achievements  where enrolment_no="${req.user.enroll_no}"`;
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.render("student_non_academic_skill", {
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


router.post("/add_project",middlewares.verifyUser, (req, res, next) => {
  //console.log(data);

  var title = req.body.skillTitle;
  var projectDes = req.body.skillDescription;
 
  // var enroll=req.body.enrolment_no;
  
  //console.log(global.global_enrollment);
  //var enr = store.get("global_enrollment");
  //console.log(enr);

  
  var sql = `insert into non_academic_achievements  (skillTitle,skillDescription , enrolment_no) values ( "${title}","${projectDes}","${req.user.enroll_no}")`;
  con.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_non_academic_skill");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.redirect("student_non_academic_skill");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});


router.get("/deleteNonAcadSkill", async (req, res) => {
  try {
    var id = req.query.id;
    var sql = `DELETE FROM non_academic_achievements where id=?`;
    con.query(sql, [id], (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.redirect("student_non_academic_skill");
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


router.get("/get_data", (req, res, next) => {
  try {
    var id = req.query.id;
     console.log(id)+"hello";

    var sql = `SELECT * FROM non_academic_achievements where id=?`;
    con.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
     //   console.log(result);

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

    var sql = `SELECT * FROM  non_academic_achievements where enrolment_no="${req.user.enroll_no}"   `;
    con.query(sql, [id], (error, result) => {
      if (error) console.log(error);
      else {
       // console.log("pa")
      //  console.log(result);

        res.json(result);
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});


//

//edit non acad skill
router.post("/updateProjects", (req, res, next) => {
  var projectDes = req.body.skillDescription;
  var skillTitle = req.body.skillTitle;

  var id = req.query.id;
  console.log(skillTitle);

  var sql = `update   non_academic_achievements set skillDescription="${projectDes}", skillTitle='${skillTitle}' where id=?`;
  con.query(sql, [id], function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_non_academic_skill");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.redirect("student_non_academic_skill");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});

///
router.get("/admin_student_non_academic_skill", middlewares.verifyUser, async (req, res) =>{
  try {
    var sql = `SELECT * FROM non_academic_achievements  where enrolment_no="${req.user.enroll_no}"`;
    con.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.render("admin_student_non_academic_skill", {
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



module.exports = router;
