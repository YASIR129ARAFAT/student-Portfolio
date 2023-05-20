const express = require("express");
var db = require("../database/db");
const router = express.Router();
var { data } = require("./loginauth");
const middlewares = require("../utils/verifyUser.js");



router.get("/getDetails", middlewares.verifyUser, (req, res, next) => {
  try {
    var id = req.query.id;

    var sql = `SELECT * FROM student_data where enroll_no="${req.user.enroll_no}" `;
    db.query(sql , (error, result) => {
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


module.exports=router;