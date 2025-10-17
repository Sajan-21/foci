const User = require('../models/User');
const jwt = require('../utils/jwt');
const bcrypt = require('../utils/bcrypt');
const regExp = require("../utils/regExp");
const { generateOTP } = require("../utils/generateOtp");
const Otp = require("../models/Otp");
const { sendMail } = require('../utils/sendMail');
const { OTPtemplate } = require("../utils/emailTemplates/OTPtemplate");
const cloudinaryUploads = require("../utils/cloudinaryUpload").uploadToCloudinary;
const { sendResponse } = require("../utils/responseHandler");

exports.signUp = async(req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if(!name || !email || !password || !phone ) {
            return sendResponse(res, 400, false, "input fields missing");
        }

        if(!regExp.gmailRegex.test(email) || !regExp.usernameRegex.test(name)) {
            return sendResponse(res, 400, false, !regExp.gmailRegex.test(email)? "wrong mail format" : "name is too long");
        }

        const checkEmailExistency = await User.findOne({email});

        if(checkEmailExistency) {
            return sendResponse(res, 400, false, "This email already exist. Try login.");
        }

        if(!regExp.passwordRegex.test(password)) {
            return sendResponse(res, 400, false, "password must contain minimum 8 characters\nupperCase letter\nlowerCase letter\natleast one special character\natleast one digit");
        }

        const hashedPassword = bcrypt.hashValues(password);

        if(!regExp.phoneRegex.test(phone)) {
            return sendResponse(res, 400, false, "please enter a valid 10 digit phone number");
        }

        let newUser = {
                name,
                email,
                phone,
                password: hashedPassword,
            }

        if(req.file) {
            const result = await cloudinaryUploads(req.file.buffer, "avatars");
            const avatar = result.secure_url;
            const public_id = result.public_id;

            newUser = {
                ...newUser,
                image: {
                    avatar,
                    public_id
                }
            }
        }

        const addUser = await User.create(newUser);

        const token = jwt.generateToken(addUser._id, "4d");

        if(addUser) {
            return sendResponse(res, 200, true, `welcome to foci ${addUser.name}`, token);
        }

    } catch (error) {
        console.log("error from signUp: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
}

exports.login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return sendResponse(res, 400, false, !email? "email required" : "password required");
        }

        if(!regExp.gmailRegex.test(email)) {
            return sendResponse(res, 400, false, "wrong mail format");
        }

        if(!regExp.passwordRegex.test(password)) {
            return sendResponse(res, 400, false, "password must contain minimum 8 characters\nupperCase letter\nlowerCase letter\natleast one special character\natleast one digit");

        }

        const userData = await User.findOne({email});
        if(!userData) {
            return sendResponse(res, 401, false, "user not found");
        }

        const checkPassword = bcrypt.compareValues(password, userData.password);
        if(!checkPassword) {
            return sendResponse(res, 400, false, "invalid password");
        }

        const token = jwt.generateToken(userData._id, "4d");

        if(token) {
            return sendResponse(res, 200, true, "logged in succesfully", token);
        }

    } catch (error) {
        console.log("error from login: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
}

exports.emailVerification = async(req, res) => {
    try {
        const email = req.body.email;
        if(!email || !regExp.gmailRegex.test(email)) {
            return sendResponse(res, 400, false, !email? "email required" : "please enter a valid email");
        }

        const userData = await User.findOne({email});
        if(!userData) {
            return sendResponse(res, 401, false, "user not found");
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
            return sendResponse(res, 200, true, "email verified succesfully\nplease check your mail and enter the otp within 3 minutes to proceed");
        // }

    } catch (error) {
        console.log("error from emailVerification: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
}

exports.otpVerification = async(req, res) => {
    try {
        const { email } = req.params;
        if(!email || !regExp.gmailRegex.test(email)) {
            return sendResponse(res, 400, false, "something went wrong related to mail");
        }

        const { otp } = req.body;
        if(!otp || !regExp.otpRegex.test(otp)) {
            return sendResponse(res, 400, false, !otp? "otp required": "otp must contain 6 digit without white space");
        }

        const otpData = await Otp.findOne({email});
        if(!otpData) {
            return sendResponse(res, 400, false, "otp expired");
        }

        if(otp != otpData.otp) {
            return sendResponse(res, 401, false, "invalid otp");
        }

        return sendResponse(res, 200, true, "OTP verified succesfully");

    } catch (error) {
        console.log("error in otpVerification: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
}

exports.resetForgetPassword = async(req, res) => {
    try {
        const { email } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if(!email || !newPassword || !confirmPassword || !regExp.gmailRegex.test(email) || !regExp.passwordRegex.test(newPassword) || !regExp.passwordRegex.test(confirmPassword)) {
            return sendResponse(res, 400, false, "something went wrong with the incoming data");
        }

        const userData = await User.findOne({email});
        if(!userData) {
            return sendResponse(res, 401, false, "user not found");
        }

        if(newPassword !== confirmPassword) {
            return sendResponse(res, 401, false, "password and confirm password are not matching");
        }

        const hashedPassword = bcrypt.hashValues(newPassword);

        const updatePassword = await User.updateOne({email}, {$set: {password: hashedPassword}});

        if(updatePassword) {
            return sendResponse(res, 204, true, "password updated succesfully");
        }

    } catch (error) {
        console.log("error in resetForgetPassword: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
}