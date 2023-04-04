const express = require("express");
var db = require("../database/db");
const router = express.Router();
//to render project page
router.get("/student_project", (req, res, next) => {
  res.render("student_project");



});


//to get data from project overview table and show in database


router.get("/get_data", (req, res) => {
  const start_index = req.query.start_index;
  const num_record = req.query.number_of_record;
  var sql = `select   * from project_overview order by project_count asc limit ${start_index} , ${10}`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);

      res.json(result);
    }
  });
});

router.post("/update_project", (req, res, next) => {
  

});






// to add new project

router.post("/add_project", (req, res, next) => {
    var title =req.body.title;
     var enroll=req.body.enroll;

    
    var description=req.body.description;
    console.log(title);
    console.log(description);
      var sql = `insert into project_overview  (desription, enroll_no, title) values ( "${description}","${enroll}","${title}")`;
       db.query(sql, function (err, result) {
     if (err) {
      //  req.flash("message", "customer Id already exist");
       res.render("student_project");
       console.log(err)
     } else {
      
       console.log("Row has been updated");
       res.render('student_project')
      //  req.flash("message", "seccessfully registered");
      //  res.render("student_project");

     }
   });
});

module.exports=router;
