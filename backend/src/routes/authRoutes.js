const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const { upload } = require('../utils/cloudinaryUpload');

router.post("/foci/auth/signup", upload.single('avatar'), authController.signUp);
router.post("/foci/auth/login", authController.login);
router.post("/foci/auth/emailVerification", authController.emailVerification);
router.post("/foci/auth/otpverification/:email", authController.otpVerification);
router.post("/foci/auth/resetforgotpassword/:email", authController.resetForgetPassword);

module.exports = router;