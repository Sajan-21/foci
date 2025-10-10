const { sendResponse } = require("../utils/responseHandler");
const jwt = require("../utils/jwt");
const User = require("../models/User");

exports.authMiddleware = async(req, res, allowed, next) => {
    try {
        const allowedUserTypes = allowed.split(",");
        const token = req.headers['authorization'].split(" ")[1];
        if(!token || token === "null" || token === null || token ==="undefined" || token === undefined || token == "") {
            return sendResponse(res, 400, false, "not authenticated");
        }

        const _id = jwt.verifyToken(token);

        const userData = await User.findById(_id);
        if(!userData || !userData.permission) {
            return sendResponse(res, 400, false, !userData ? "user not found" : "you are blocked by Admin");
        }

        if(allowedUserTypes && allowedUserTypes.includes(userData.role)) {
            req.body._id = userData._id;
            next();
        }else {
            return sendResponse(res, 400, false, "you are not allowed to access this functionality");
        }

    } catch (error) {
        console.log("error in authMiddleware: ", error);
        return sendResponse(res, 400, false, error.message? error.message : error);
    }
}