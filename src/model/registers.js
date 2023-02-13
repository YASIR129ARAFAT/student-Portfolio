const mongoose = require("mongoose");
const myschema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
   
  },
 
);
const Register = mongoose.model("Register", myschema);
module.exports = Register;

