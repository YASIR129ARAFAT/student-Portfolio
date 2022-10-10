const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const myschema = require("./model/user");

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to data base");
  }
);

const staticpath = path.join(__dirname, "../public");
const partialpath = path.join(__dirname, "../templates/partials");
const templatepath = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);
// console.log(staticpath);

const port = 80; //IF PROCESS.ENV NOT AVAILABLE THEN GOES ON 3000
app.get("/login", (req, res) => {
  // console.log("hello")
  // res.render("login");
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/weather", (req, res) => {
  res.render("weather");
});

app.post("/save", async (req, res) => {
  const data1 = new myschema({
    username: req.body.name,
    // email: req.body.email,
    // password: req.body.password,
  });
  console.log(data1);
  const userdata = await data1.save();

  res.render("weather");
});
app.get("/getmydata",async (req, res) => {
  const data= await myschema.find();
  console.log(data);
  res.send("hello");
});




app.get("/*", (req, res) => {
  res.render("404error");
});

app.listen(port, () => {
  console.log(`listening to ${port} `);
});
