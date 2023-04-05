const express = require("express");
var db = require("../database/db");
const router = express.Router();
//to render project page
router.get("/student_non_academic_skill", (req, res, next) => {
  res.render("student_non_academic_skill");
});

//to get data from project overview table and show in database

router.get("/get_data", (req, res) => {
  const start_index = req.query.start_index;
  const num_record = req.query.number_of_record;
  var sql = `select   * from non_academic_skill order by skill_count asc limit ${start_index} , ${10}`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      //  console.log(result);

      res.json(result);
    }
  });
});

let particular_project_id;

router.get("/get_data_particular", (req, res) => {
  const project_count = req.query.project_id;
console.log(project_count);

  var sql = `select   * from    non_academic_skill   where skill_count="${project_count}"`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
       console.log(result);
      particular_project_id = result[0].skill_count;

      res.json(result);
    }
  });
});

//to update project details
router.post("/update_project", (req, res, next) => {
  var title = req.body.title;
  // var project_count = req.body.project_count;
  // var enroll = req.body.enroll;
  var description = req.body.description;
  var sql = `update  non_academic_skill   set title="${title}", description="${description}"where skill_count="${particular_project_id}" `;
  db.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_non_academic_skill");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.render("student_non_academic_skill");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});

//to delete a particular project
router.post("/delete_project", (req, res, next) => {
  console.log();

  var sql = `delete from  non_academic_skill  where skill_count="${particular_project_id}" `;
  db.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_non_academic_skill");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.render("student_non_academic_skill");
    }
  });
});

// to add new project

router.post("/add_project", (req, res, next) => {
  var title = req.body.title;
  var enroll = req.body.enroll;

  var description = req.body.description;
  console.log(title);
  console.log(description);
  var sql = `insert into non_academic_skill  ( title, description, enroll_no) values ( "${title}","${description}","${enroll}")`;
  db.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("student_non_academic_skill");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.render("student_non_academic_skill");
    
    }
  });
});

module.exports = router;
