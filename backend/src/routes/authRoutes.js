const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/foci/auth/signup", authController.signUp);
router.post("/foci/auth/login", authController.login);
router.post("/foci/auth/emailVerification", authController.emailVerification);
router.post("/foci/auth/otpverification/:email", authController.otpVerification);
router.post("/foci/auth/resetforgotpassword/:email", authController.resetForgetPassword);

module.exports = router;