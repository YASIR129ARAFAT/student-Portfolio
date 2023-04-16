// const express = require("express");
// var db = require("../database/db");
// const router = express.Router();
// var { data } = require("./loginauth");
// const middlewares = require("../utils/verifyUser.js");

// router.get("/user_land", (req, res) => {
//     res.render("user_land");
//   });
  
// // router.get("/user_land",middlewares.verifyUser, async (req, res) => {
// //     try {
  
          
// //       var sql = `SELECT * FROM projects where enrolment_no="${req.user.enroll_no}" `;
// //       db.query(sql, (error, result) => {
// //         if (error) console.log(error);
// //         else {
// //           // console.log(result);
  
// //           res.render("projects", {
// //             projects: result,
// //           });
// //         }
// //       });
// //     } catch (error) {
// //       if (error) {
// //         console.log(error);
// //       }
// //     }
// //   });

// router.get("/projects", middlewares.verifyUser, (req, res, next) => {
//     try {
//         console.log("hello")
//       var sql = `select * from projects where enrolment_no = "${req.user.enroll_no}";`;
//       db.query(sql , (error, result) => {
//         if (error) console.log(error);
//         else {
//         res.render("user_land")
//           res.json(result);
//         }
//       });
//     } catch (error) {
//       if (error) {
//         console.log(error);
//       }
//     }
//   });
//   module.exports=router;