const { sendResponse } = require("../utils/responseHandler");
const regExp = require("../utils/regExp");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

exports.updateUserName = async(req, res) => {
    try {
        const { name, _id } = req.body;
        if(!name || !regExp.usernameRegex.test(name)) {
            return sendResponse(res, 400, false, !name ? "name required": "name must be under 25 characters\nenglish alphabets, numbers, underscore are only allowed characters");
        }
        if(!_id) {
            return sendResponse(res, 400, false, "can't access the requested user");
        }

        const updateName = await User.findByIdAndUpdate(_id, {$set: {name}});
        if(!updateName) {
            return sendResponse(res, 400, false, "username updation failed");
        }else {
            return sendResponse(res, 200, true, "userName updated succesfully");
        }

    } catch (error) {
        console.log("error in updateUserName: ", error);
        return sendResponse(res, false, 500, error.message || error);
    }
}

exports.updateAvatar = async(req, res) => {
    try {
        const {newAvatar, _id} = req.file;
        if(!newAvatar || !_id) {
            return sendResponse(res, 400, false, !newAvatar ? "image required" : "internal error: requested user's _id not found");
        }

        const userData = await User.findById(_id);
        if(!userData) {
            return sendResponse(res, 401, false, "user not found");
        }

        const deleteAvatar = await cloudinary.uploader.destroy(userData.avatar.public_id);
        if(!deleteAvatar) {
            return sendResponse(res, 400, false, "avatar uploading failed");
        }
        const updateAvatar = await uploadToCloudinary(req.file.buffer, "avatars");
        const avatar = updateAvatar.secure_url;
        const public_id = updateAvatar.public_id;

        const updateUserAvatar = await User.findByIdAndUpdate(_id, {image: {avatar, public_id}}, {new: true});
        if(updateAvatar) {
            return sendResponse(res, 200, true, "avatar updated succesfully");
        }

    } catch (error) {
        console.log("error in updateAvatar: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
}