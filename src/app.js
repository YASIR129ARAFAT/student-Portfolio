const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
var session = require("express-session");
var flush = require("connect-flash");

const mongoose = require("mongoose");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

//sql database connection
var mysql = require("mysql2");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Parwez123@",
  database: "parwez",
});

db.connect(function (err) {
  if (err) {
    console.log("some error ");
  } else {
    console.log("connected");
  }
});

const staticpath = path.join(__dirname, "../public");
const partialpath = path.join(__dirname, "../templates/partials");
const templatepath = path.join(__dirname, "../templates/views");

app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);
app.use(
  session({
    secret: "secret",
    cookie: {
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flush());

// console.log(staticpath);

const port = 80; //IF PROCESS.ENV NOT AVAILABLE THEN GOES ON 3000

app.get("/register", (req, res) => {
  res.render("register", { message: req.flash("message") });
});

app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});

app.get("/bank", (req, res) => {
  res.render("bank", { message: req.flash("message") });
});

app.get("/new_account", (req, res) => {
  res.render("new_account", { message: req.flash("message") });
});

app.get("/deposit", (req, res) => {
  res.render("deposit");
});

app.post("/login", async (req, res) => {
  var user = req.body.custid;
  if (user.length == 0) {
    req.flash("message", "please enter  custid");
    res.redirect("login");
  }

  var pass = req.body.password;
  console.log(user + " " + pass);

  var sql = `select fname, password from customer where custid="${user}"`;

  db.query(sql, function (err, result) {
    if (err) {
      console.log(err);

      console.log("username password doesnot matched");
      req.flash("message", "username and password does not match");
      res.redirect("login");
    } else {
      if (result.length == 0) {
        req.flash("message", "please enter valid password");
        res.redirect("login");
      }
      console.log(result[0]);
      let gg = result[0].password;

      if (gg.localeCompare(pass) == 0) {
     
         






    var  kk=result[0].fname;

        res.redirect("bank", {kk : kk});
      } else {
        console.log("username or password doesnot matched");
        req.flash("message", "username and password does not match");
        res.redirect("login");
      }
    }
  });
});

app.post("/save", function (req, res, next) {
  var custid = req.body.customerId;
  var firstName = req.body.firstName;
  var middleName = req.body.middleName;
  var lastName = req.body.lastName;
  var city = req.body.city;
  var email = req.body.email;
  var mobNo = req.body.mobileNumber;
  var occ = req.body.occupation;
  var dob = req.body.dob;
  var pass = req.body.password;
  var sql = `INSERT INTO customer VALUES ("${custid}","${firstName}", "${middleName}", "${lastName}", "${city}" , "${email}" ,  "${mobNo}" , "${occ}" , '${dob}' , "${pass}");`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("message", "customer Id already exist");
      res.redirect("register");
    } else {
      // console.log(id,' ',name,' ',email,' ',message,'\n');
      console.log("Row has been updated");
      req.flash("success", "Data stored!");
      res.redirect("login");
    }
  });
});

//
app.post("/save_account", async (req, res) => {
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var address = req.body.address;
  var number = req.body.number;
  var aadhar_number = req.body.aadhar_number;
  var dob = req.body.dob;
  var branch = req.body.branch;
  var AnnualIncome = req.body.AnnualIncome;
  var gender = req.body.gender;
  var amount = req.body.amount;

  var sql = `INSERT INTO register_account (fname, lname, email, address, number, aadhar_number, dob, branch, AnnualIncome, gender, amount) VALUES ("${fname}",
   "${lname}", "${email}", "${address}", "${number}", "${aadhar_number}", "${dob}", "${branch}", "${AnnualIncome}", "${gender}", "${amount}")`;
  db.query(sql, function (err, result) {
    if (err) {
      req.flash("message", "cannot insert enter the valid input");
      res.redirect("new_account");
    } else {
      console.log("record inserted");
      req.flash("message", "record succesffuly saved");
      res.redirect("new_account");
    }
  });
});

app.get("/users", async (req, res) => {
  db.query("SELECT * FROM register_account", function (err, result, fields) {
    if (err) throw err;
    //  console.log(result);
    res.render("users", { result: result });
  });
});

app.get("/", (req, res) => {
  res.render("bank");
});

app.listen(port, () => {
  console.log(`listening to ${port} `);
});
