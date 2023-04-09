const express = require("express");
var con = require("../database/db");
const router = express.Router();
var store = require("store-js");
//to render project page
router.get("/student_non_academic_skill", async (req, res) => {
  try {
    var sql = `SELECT * FROM non_academic_achievements`;
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


router.post("/add_project", (req, res, next) => {
  //console.log(data);

  var title = req.body.skillTitle;
  var projectDes = req.body.skillDescription;
 
  // var enroll=req.body.enrolment_no;
  
  //console.log(global.global_enrollment);
  var enr = store.get("global_enrollment");
  console.log(enr);

  
  var sql = `insert into non_academic_achievements  (skillTitle,skillDescription , enrolment_no) values ( "${title}","${projectDes}",${enr})`;
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
        console.log(result);

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
   

  var id = req.query.id;
  //console.log(id + "update");

  var sql = `update   non_academic_achievements set skillDescription="${projectDes}"    where id=?`;
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






//to get data from project overview table and show in database



module.exports = router;
