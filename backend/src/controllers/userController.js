const { sendResponse } = require("../utils/responseHandler");
const regExp = require("../utils/regExp");
const User = require("../models/User");

exports.updateUserName = async(req, res) => {
    try {
        const { name, _id } = req.body;
        if(!name || !regExp.usernameRegex.test(name)) {
            return sendResponse(res, false, 400, !name ? "name required": "name must be under 25 characters\nenglish alphabets, numbers, underscore are only allowed characters");
        }
        if(!_id) {
            return sendResponse(res, false, 400, "can't access the _id");
        }

        const userData = await User.findByIdAndUpdate(_id, {$set: {name}});
        if(!userData) {
            return sendResponse(res, 400, false, "username updation failed");
        }else {
            return sendResponse(res, 200, true, "userName updated succesfully");
        }
        
    } catch (error) {
        console.log("error in updateUserName: ", error);
        return sendResponse(res, false, 400, error.message ? error.message : error);
    }
}