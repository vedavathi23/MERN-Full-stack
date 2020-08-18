var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator")
const { signup, signin, signout, isSignedIn } = require("../controllers/auth");

// Signup 

router.post("/signup", [
    check("name", "Name should be at least 3 characters.").isLength({min: 3}),
    check("email", "Email is required.").isEmail(),
    check("password").isLength({min:3, max:5}).withMessage("Password must be atleast 5 characters long.")
], signup)

// Signin

router.post("/signin", [
    check("email", "Email is required.").isEmail(),
    check("password").isLength({min:1}).withMessage("Password field cannot be empty.")
], signin)

// Signout

router.get("/signout", signout)

// isSignedIn

router.get("/testroute", isSignedIn, (req, res) => {
    res.json(req.auth);
})

module.exports = router;