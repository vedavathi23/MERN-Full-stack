const User = require("../models/user")
const { check, validationResult } = require("express-validator");
const user = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// Signup

exports.signup = (req, res) => {
    
    // console.log("REQUEST BODY", req.body);
    // res.json({
    //     message: "Thanks for signing up..."
    // });

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "Not able to save the USER in DB"
            });
        }
        res.json({
            name: user.name,
            email: user.email,
            id:user._id
        });
    });
};

// Signin

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const {email,password} = req.body;
  
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }

    //finding single user

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "Email does not exist."
            })
        }
  

    // authenticate user

    if(!user.authenticate(password)){
        return res.status(401).json({
            error: "Email and password does not matches."
        })
    }

    // create token

    const token = jwt.sign({_id: user._id}, process.env.SECRET)

    // put a token in cookie

    res.cookie("token", token, {expire: new Date() + 9999});

    // send  response to front end

    const {_id, name, email, role} = user;
    return res.json({token, user: {_id, name, email, role}});

    })

};

// Signout 

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "You have successfully signed out..."
    })
};

// Protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty : "auth"
});

// Custom middlewares

// Checking user authentication

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
}

// Checking whether user is ADMIN or not

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not Admin, Access denied."
        })
    }
    next();
}