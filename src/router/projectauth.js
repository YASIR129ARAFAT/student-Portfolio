const express = require("express");
var db = require("../database/db");
const router = express.Router();
var {data}=require('./loginauth');
console.log(data);

var store = require("store-js");
//to render project page
router.get("/projects", async (req, res) => {
  try {

    var sql = `SELECT * FROM projects`;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {
       // console.log(result);

        res.render("projects", {
          projects: result,
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
  
  var title = req.body.projectTitle;
  var projectDes = req.body.projectDescription;
  var githubLink = req.body.gitHubLink;
  var instructor = req.body.instructor;
  // var enroll=req.body.enrolment_no;
  var isVerified = req.body.isVerified;

  //console.log(global.global_enrollment);
  var enr = store.get("global_enrollment");
  console.log(enr);

  var projectDes = req.body.projectDescription;
  var sql = `insert into projects  (projectTitle,projectDescription ,gitHubLink, instructor, enrolment_no,isVerified ) values ( "${title}","${projectDes}","${githubLink}", "${instructor}", ${enr},${1})`;
  db.query(sql, function (err, result) {
    if (err) {
      //  req.flash("message", "customer Id already exist");
      res.render("projects");
      console.log(err);
    } else {
      console.log("Row has been updated");
      res.redirect("projects");
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");
    }
  });
});




router.get("/addProjects", (req, res, next) => {
  res.render("addProjects");
});


router.get("/get_data", (req, res, next) => {
  
   try {
    var id=req.query.id;

     var sql = `SELECT * FROM projects where id=?`;
     db.query(sql,[id], (error, result) => {
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



//to get data from project overview table and show in database




let particular_project_id;





//to update project details
router.post("/updateProjects", (req, res, next) => {

 var projectDes = req.body.projectDescription;
 var githubLink = req.body.gitHubLink;
 var instructor = req.body.instructor;
 // var enroll=req.body.enrolment_no;

 //console.log(global.global_enrollment);
 //var enr = store.get("global_enrollment");
 //console.log(enr);

 
 var id=req.query.id;
console.log(id+"update");

 var sql = `update   projects  set projectDescription="${projectDes}" ,gitHubLink="${githubLink}", instructor="${instructor}"   where id=?`;
 db.query(sql, [id], function (err, result) {
   if (err) {
     //  req.flash("message", "customer Id already exist");
     res.render("projects");
     console.log(err);
   } else {
     console.log("Row has been updated");
     res.redirect("projects");
     //  req.flash("message", "seccessfully registered");
     //  res.render("student_project");
   }
 });
});


//to delete a particular project
router.get("/deleteProject", (req, res, next) => {
   try {
     var id = req.query.id;
     var sql = `DELETE FROM projects where id=?`;
     db.query(sql, [id], (error, result) => {
       if (error) {
         console.log(error);
       } else {
         res.redirect("projects");
       }
     });
   } catch (error) {
     if (error) {
       console.log(error);
     }
   }
});









// to add new project



module.exports=router;
