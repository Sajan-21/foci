const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/foci/auth/signup", authController.signUp);
router.post("/foci/auth/login", authController.login);
router.post("/foci/auth/emailVerification", authController.emailVerification);

module.exports = router;