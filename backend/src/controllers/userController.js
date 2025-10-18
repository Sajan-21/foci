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

exports.updateAvatar = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return sendResponse(res, 400, false, "requested user's _id not found");
    }
    if (!req.file) {
      return sendResponse(res, 400, false, "image required");
    }

    const userData = await User.findById(_id);
    if (!userData) {
      return sendResponse(res, 404, false, "user not found");
    }

    if (userData.image?.public_id) {
      await cloudinary.uploader.destroy(userData.image.public_id);
    }

    const [uploadedAvatar] = await uploadToCloudinary([req.file], "avatars");
    const img_url = uploadedAvatar.secure_url;
    const public_id = uploadedAvatar.public_id;

    const updatedUser = await User.findByIdAndUpdate(_id, {avatar: {img_url, public_id}}, {new: true});

    if (!updatedUser) {
      return sendResponse(res, 400, false, "avatar update failed");
    }

    return sendResponse(res, 200, true, "avatar updated successfully", avatar);
  } catch (error) {
    console.log("error in updateAvatar: ", error);
    return sendResponse(res, 500, false, error.message || error);
  }
};