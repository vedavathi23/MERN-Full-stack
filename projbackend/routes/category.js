const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getCategoryId, createCategory, getAllCategories, getCategory, updateCategory, removeCategory } = require("../controllers/category")

// Params

router.param("userId", getUserById)
router.param("categoryId", getCategoryId)

// Actual Routes

// Read Routes

router.get("/categories", getAllCategories)
router.get("/category/:categoryId", getCategory)

// Create Routes

router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)

// Update Routes

router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

// Delete Routes

router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)

module.exports = router;