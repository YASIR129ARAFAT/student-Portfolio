const express = require("express");
var db = require("../database/db");
const router = express.Router();
var {
  data
} = require("./loginauth");
const middlewares = require("../utils/verifyUser.js");

var enroll_of_user;

router.get("/searchedUser", async (req, res) => {
  enroll_of_user = req.query.value;
  //console.log(enroll_of_user+" kya");

  res.render('searchedUser')
});

router.get("/get_data2", (req, res, next) => {
  try {
    // var id = req.query.id;
    //   console.log(req.user.enroll_no);
    console.log(enroll_of_user + " project me");

    var sql = `SELECT * FROM projects where enrolment_no="${enroll_of_user}" `;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {
        console.log("project");

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



router.get("/get_data3", (req, res, next) => {
  try {
    // var id = req.query.id;

    var sql = `SELECT * FROM  academic_achievements where enrolment_no="${enroll_of_user}"  `;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {
        //   console.log("pa");
        console.log("acad");
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


router.get("/get_data4", (req, res, next) => {
  try {
    //  var id = req.query.id;

    var sql = `SELECT * FROM  non_academic_achievements where enrolment_no="${enroll_of_user}" and hide='not_hide'`;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {
        console.log("nonacad");

        // console.log("pa")
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


router.get("/get_data5", (req, res, next) => {
  try {
    //   var id = req.query.id;

    var sql = `select * from student_data t1, description t2, links t3 where t1.enroll_no = t2.enroll_no and t2.enroll_no = t3.enroll_no and t1.enroll_no = "${enroll_of_user}";`;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {
        console.log("des ");

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




module.exports = router;