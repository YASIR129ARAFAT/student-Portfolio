const express = require("express");
var db = require("../database/db");
const router = express.Router();
var {
  data
} = require("./loginauth");
const middlewares = require("../utils/verifyUser.js");

// to render links page with sending all links
router.get("/links", middlewares.verifyUser, async (req, res) => {
  try {
    var message=req.query.message;
    var sql = `SELECT * FROM links where enroll_no="${req.user.enroll_no}" `;
    db.query(sql, (error, result) => {
      if (error) console.log(error);
      else {

        res.render("links", {
          links: result,
          message
        });
      }
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
});
router.post("/addLinks", middlewares.verifyUser,async (req, res) => {
  try {
    var enroll_no = req.user.enroll_no;
    console.log(enroll_no);
    var gitHubLink = req.body.gitHubLink;
    var instagramLink = req.body.instagramLink;
    var twitterLink = req.body.twitterLink;

    var sql = `update links set github='${gitHubLink}', instagram='${instagramLink}',twitter='${twitterLink}' where enroll_no='${enroll_no}'`;
    db.query(sql, (error, result) => {
      if (error) {
        console.log('links insertion errror', error);

      } else {
        //done
        res.redirect('/api/linkauth/links?message=1');
      }
    })
  } catch (error) {
    if (error) {
      console.log(error);
    }
  }
})

router.get('/getEditMyProfile',(req,res)=>{
  var email = req.query.email;
  var year = req.query.year;
  var mobile_no = req.query.mobile_no;

  res.render('editMyProfile',{email,year,mobile_no})
})

router.post('/postEditMyProfile',middlewares.verifyUser,(req,res)=>{
  var email = req.body.email;
  var mobile_no = req.body.mobile_no;
  var year = parseInt(req.body.year);
  var enroll_no=req.user.enroll_no;

  var sql = `update student_data set email='${email}',mobile_no='${mobile_no}', year=${year} where enroll_no='${enroll_no}'`;

  db.query(sql,(error,result)=>{
    if(error){
      console.log(error)
    }
    else{
      
      res.redirect('/student_data?message=sucessfullyCompleted');
    }
  })
})


router.get("/admin_student_data",middlewares.verifyUser, (req, res) => {

  var sql =`select * from student_data where enroll_no='${req.user.enroll_no}'`
  db.query(sql,(error,result)=>{
    if(error){
      console.log(error,'jhsas');
    }
    else{

      res.render("admin_student_data",{result});
    }
  })

});

module.exports = router;