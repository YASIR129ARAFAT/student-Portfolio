const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const express = require('express')

 const verifyUser = (req, res, next) => {
  let cookie = req.cookies.access_token;
  if(!cookie)next();
  jwt.verify(cookie, "parwez", (err, user) => {
    req.user = user;
    next();
  });
};

exports.verifyUser = verifyUser;
// exports.errhandle = errhandle; start