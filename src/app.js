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
var userkiId;
var genereted_account_no;

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

function generateSortedString() {
  let numbers = [];
  for (let i = 1; i <= 5; i++) {
    numbers.push(Math.floor(Math.random() * 10));
  }
  numbers.sort();
  return numbers.join("");
}

var gname;

app.get("/register", (req, res) => {
  res.render("register", { message: req.flash("message") });
});

app.get("/login", (req, res) => {
  res.render("login", { message: req.flash("message") });
});

app.get("/bank", (req, res) => {
  res.render("bank", { gname: gname });
});

app.get("/new_account", (req, res) => {
  res.render("new_account", { message: req.flash("message") });
});

app.get("/deposit", (req, res) => {
  res.render("deposit");
});
app.get("/alredyHaveAcc", (req, res) => {
  res.render("alredyHaveAcc");
});
app.get("/transfer", (req, res) => {
  res.render("transfer");
});
app.get("/withdraw", (req, res) => {
  res.render("withdraw", { message: req.flash('message')});
})

app.get("/congrats_message", (req, res) => {
  res.render("congrats_message", {
    genereted_account_no: genereted_account_no,
  });
});

app.post("/login", async (req, res) => {
  userkiId = req.body.custid;
  console.log(userkiId);

  var user = req.body.custid;
  if (user.length == 0) {
    req.flash("message", "please enter  custid");
    res.redirect("login");
  }

  var pass = req.body.password;
  console.log(user + " " + pass);

  var sql = `select fname,  password from customer where custid="${user}"`;

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
      } else {
        console.log(result[0].password);
        let gg = result[0].password;

        if (gg.localeCompare(pass) == 0) {
          var kk = result[0].fname;
          gname = kk;
          res.redirect("bank");
        } else {
          console.log("username or password doesnot matched");
          req.flash("message", "username and password does not match");
          res.redirect("login");
        }
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

app.post("/save_account", async (req, res) => {
  var accno = generateSortedString();
  genereted_account_no = accno;

  var openbal = req.body.accountOpeningBalance;
  var atype = req.body.accountType;
  var acstatus = "open";
  var aod = req.body.accountOpeningDate;
  var adhno = req.body.Aadharnumber;
  //  console.log(user);
  var sql = `INSERT INTO account VALUES ("${accno}" , "${userkiId}" , ${openbal} , '${aod}' , "${atype}" , "${acstatus}" , "${adhno}");`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log("err");
    }
    // console.log(id,' ',name,' ',email,' ',message,'\n');
    else {
      console.log("Row has been updated");
      req.flash("success", "Data stored!");

      res.redirect("congrats_message");
    }
  });
});

app.post("/deposit", function (req, res, next) {
  var tno = generateSortedString();
  var accno = req.body.nAccNo;
  var transamount = req.body.nAmount;
  var sql = `INSERT INTO trandetails VALUES ("${tno}" , "${accno}" , NOW() , "Deposit" , ${transamount});`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    // console.log(id,' ',name,' ',email,' ',message,'\n');
    console.log("Row has been updated");
    req.flash("success", "Data stored!");
    // res.redirect('/welcome.ejs')
  });
  var sql = `update account set opening_balance = opening_balance + ${transamount} where acnumber = "${accno}";`;
  db.query(sql, function (err, result) {
    if (err) throw err;
    // console.log(id,' ',name,' ',email,' ',message,'\n');
    console.log("Row has been updated");
    req.flash("success", "Data stored!");
    res.redirect("alredyHaveAcc");
  });
});

app.get("/users", async (req, res) => {
  db.query("SELECT * FROM customer", function (err, result, fields) {
    if (err) throw err;
    //  console.log(result);
    res.render("users", { result: result });
  });
});

app.post("/transfer", function (req, res, next) {
  var tno = generateSortedString();
  var accno1 = req.body.nAccNo1;
  var accno2 = req.body.nAccNo2;

  var transamount = req.body.nAmount;
  var sql = `select opening_balance from account where acnumber="${accno1}"`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log("enter correct account");
    } else {
      if (result[0].opening_balance >= transamount) {
        var sql1 = `update account set opening_balance = opening_balance + ${transamount} where acnumber = "${accno2}";`;
        db.query(sql1, function (err, result1) {
          if (err) {
            console.log("transfer not succesffull or account not exist");
          } else {
            var sql2 = `update account set opening_balance = opening_balance - ${transamount} where acnumber = "${accno1}";`;
            db.query(sql2, function (err, result2) {
              if (err) {
              } else {
                console.log("succesfully upadated;");
              }
            });
          }
        });
      } else {
        console.log("insufficient balance");
      }
    }
    // res.redirect('/welcome.ejs')
  });
});

app.post("/withdraw", function (req, res, next) {
  var tno = generateSortedString();
  var accno = req.body.nAccNo;
  var transamount = req.body.nAmount;
  var sql = `select opening_balance from account where acnumber="${accno}"`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log("erroor");
      req.flash('success', "some error occured!");
      res.render("withdraw")
    } else {



      if (result[0].opening_balance >= transamount) {
        var sql1 = `update account set opening_balance = opening_balance - ${transamount} where acnumber = "${accno}";`;
        db.query(sql1, function (err, result1) {
          if (err) {
            console.log("transfer not succesffull or account not exist");
              req.flash('success', "transfer not successful!");
              res.render("withdraw");
          } else {
              console.log("successfully withdrawn")
              req.flash('success', "successfully withdrawn!");
              res.render("withdraw" );
          }
        });
      } else {
        console.log("insufficient balance");
         req.flash("success", "sinsuffient balance!");
         res.render("withdraw");
      }
    }
    // res.redirect('/welcome.ejs')
  });
 
});

app.get("/users", async (req, res) => {
  db.query(`SELECT * FROM account where custid="${userkiId}"`, function (err, result, fields) {
    if (err) throw err;
      console.log(result);
    res.render("users", { result: result });
  });
});

app.get("/", (req, res) => {
  res.render("bank");
});

app.listen(port, () => {
  console.log(`listening to ${port} `);
});
