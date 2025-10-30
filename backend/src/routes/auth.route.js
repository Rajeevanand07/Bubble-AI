const express = require("express");
const authController = require("../../src/controllers/auth.controller");
const router = express.Router();
const authMiddleware = require("../../src/middlewares/auth.middleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout",authMiddleware.authUser, authController.logoutUser);
router.get("/current-user", authMiddleware.authUser, authController.getCurrentUser);

module.exports = router;
