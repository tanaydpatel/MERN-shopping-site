var express = require("express");
var router = express.Router();
const { check } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 chars long"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should be atleast 5 chars long"),
    check("email").isEmail().withMessage("Enter valid mail"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password should be atleast 5 chars long"),
    check("email").isEmail().withMessage("Enter valid mail"),
  ],
  signin
);

router.get("/signout", signout);

router.get("/testRoute", isSignedIn, (req, res) => {
  res.send("hi");
});

module.exports = router;
