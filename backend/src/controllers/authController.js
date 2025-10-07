const User = require('../models/User');
const jwt = require('../utils/jwt');
const bcrypt = require('../utils/bcrypt');
const regExp = require("../utils/regExp");
const generateOTP = require("../utils/generateOtp").generateOTP;
const Otp = require("../models/Otp");
const { sendMail } = require('../utils/sendMail');
const OTPtemplate = require("../utils/emailTemplates/OTPtemplate").OTPtemplate;

exports.signUp = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if(!name || !email || !password || !phone ) {
            return res.status(400).json({
                success: false,
                message: "input field is missing."
            });
        }

        if(!regExp.gmailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "wrong gmail format"
            });
        }

        const checkEmailExistency = await User.findOne({email});

        if(checkEmailExistency) {
            return res.status(400).json({
                success: false,
                message: "This email already exist. Try login."
            });
        }

        if(!regExp.passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "password must contain minimum 8 characters\nupperCase letter\nlowerCase letter\natleast one special character\natleast one digit"
            });
        }

        const hashedPassword = bcrypt.hashValues(password);

        if(!regExp.phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "please enter a valid 10 digit phone number"
            });
        }

        const newUser = {
            name,
            email,
            phone,
            password: hashedPassword,
        }

        const addUser = await User.create(newUser);

        const token = jwt.generateToken(addUser._id, "4d");

        if(addUser) {
            return res.status(200).json({
                success: true,
                message: `welcome to spotOn ${addUser.name}`,
                data: token
            });
        }

    } catch (error) {
        console.log("error from signUp: ", error);
        return res.status(400).json({
            success: false,
            message: error.message || error
        });
    }
}

exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: !email ? "email required" : "password required"
            });
        }

        if(!regExp.gmailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "wrong gmail format"
            });
        }

        if(!regExp.passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "password must contain minimum 8 characters\nupperCase letter\nlowerCase letter\natleast one special character\natleast one digit"
            });
        }

        const userData = await User.findOne({email});
        if(!userData) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        const checkPassword = bcrypt.compareValues(password, userData.password);
        if(!checkPassword) {
            return res.status(400).json({
                success: false,
                message: "invalid password"
            });
        }

        const token = jwt.generateToken(userData._id, "4d");

        if(token) {
                return res.status(200).json({
                success: true,
                message: "succesfully logged in",
                data: token
            });
        }

    } catch (error) {
        console.log("error from login: ", error);
        return res.status(400).json({
            success: false,
            message: error.message || error
        });
    }
}

exports.emailVerification = async(req, res) => {
    try {
        const email = req.body.email;
        if(!email || !regExp.gmailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: !email? "email required": "please enter a valid email"
            });
        }

        const userData = await User.findOne({email});
        if(!userData) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        const otp = generateOTP(6);
        console.log("otp from emailVerification: ", otp);

        const newOTP = {
            email,
            otp
        }

        const createOTP = await Otp.create(newOTP);

        /*
        const mailOptions = {
            to: email,
            subject: "otp for reset password",
            html: OTPtemplate(otp)
        }
        const sendingMail = await sendMail(mailOptions);
        */

        // if(sendingMail) {
            return res.status(200).json({
                success: true,
                message: "email verified succesfully\nplease check your mail and enter the otp within 3 minutes to proceed"
            });
        // }

    } catch (error) {
        console.log("error from emailVerification: ", error);
        return res.status(400).json({
            success: false,
            message: error.message || error
        });
    }
}

exports.otpVerification = async(req, res) => {
    try {
        const { email } = req.params;
        if(!email || !regExp.gmailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "something went wrong related to the email"
            });
        }

        const { otp } = req.body;
        if(!otp || !regExp.otpRegex.test(otp)) {
            return res.status(400).json({
                success: false,
                message: !otp? "otp required": "otp must contain 6 digit without white space"
            });
        }

        const otpData = await Otp.findOne({email});
        if(!otpData) {
            return res.status(400).json({
                success: false,
                message: "otp expired!"
            });
        }

        if(otp != otpData.otp) {
            return res.status(400).json({
                success: false,
                message: "invalid otp"
            });
        }

        return res.status(200).json({
            success: true,
            message: "otp verified"
        });

    } catch (error) {
        console.log("error in otpVerification: ", error);
        return res.status(400).json({
            success: false,
            message: error.message || error
        });
    }
}

exports.resetForgetPassword = async(req, res) => {
    try {
        const { email } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword || !regExp.gmailRegex.test(email) || !regExp.passwordRegex.test(newPassword) || !regExp.passwordRegex.test(confirmPassword)) {
            return res.status(400).json({
                success: false,
                message: "something went wrong with the incoming data"
            });
        }

        const userData = await User.findOne({email});
        if(!userData) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        }

        if(newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "confirm password not matching"
            });
        }

        const hashedPassword = bcrypt.hashValues(newPassword);

        const updatePassword = await User.updateOne({email}, {$set: {password: hashedPassword}});

        if(updatePassword) {
            return res.status(200).json({
                success: true,
                message: "password updated succesfully"
            });
        }

    } catch (error) {
        console.log("error in resetForgetPassword: ", error);
        return res.status(400).json({
            success: false,
            message: error.message || error
        });
    }
}