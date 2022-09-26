const express =require('express');
const app = express();
const hbs=require("hbs");
const path=require("path");

const staticpath=path.join(__dirname,"../public" );
const partialpath = path.join(__dirname, "../templates/partials");
const templatepath = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);
// console.log(staticpath);


const port=process.env.PORT||3000   //IF PROCESS.ENV NOT AVAILABLE THEN GOES ON 3000
app.get("", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/weather", (req, res) => {
  res.render("weather");
});


app.get("/*", (req, res) => {
  res.render("404error")
});



app.listen(port, ()=>{
    console.log(`listening to ${port} `)
})