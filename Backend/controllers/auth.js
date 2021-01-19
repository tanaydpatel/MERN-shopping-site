const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//signup controller
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
    //return array of error
  }
  //use body-parser middleware to fect body of request
  const user = new User(req.body);
  //save the user to database
  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        //return error if error from DB
        error: "NOT able to save the user",
      });
    }
    res.json({ name: user.name, mail: user.email, _id: user._id });
    //JSON object response
  });
};

exports.signin = (req, res) => {
  //extract username password from body - body-parser
  const errors = validationResult(req);
  const { password, email } = req.body;
  //validate the request

  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }

  User.findOne({ email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "USER email does not exixts",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password does not match",
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to frontend
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  //using cookie parser to clear cookie
  res.clearCookie("token");

  res.json({ msg: "Successfully signed-out !!!" });
};

exports.isSignedIn = expressJwt({
  secret: process.env.SECRET_KEY,
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!checker) {
    res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next(); //passs control to next middleware or response
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "Not authorised - ACCESS DENIED",
      msg: "you're not admin",
    });
  }
  next();
};
