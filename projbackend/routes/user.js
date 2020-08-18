const express = require("express");
const router = express.Router();

const { 
        getUserById, 
        getUser, 
        getAllUsers, 
        updateUser, 
        userPurchaseList,
        pushOrderInPurchaseList 
    } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// Params

router.param("userId", getUserById)

// Actual Routes

router.get("/users", getAllUsers)
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)
router.put("/orders/user/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList)


module.exports = router;