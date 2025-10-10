const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.generateToken = (_id, expires) => {
    try {
        const token = jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: expires});
        if(token) {
            return token
        }
    } catch (error) {
        console.log("error in generateToken: ", error);
        return error
    }
}

exports.verifyToken = (token) => {
    try {
        const tokenVerification = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                return err;
            }else {
                return decoded._id;
            }
        });
    } catch (error) {
        console.log("error in verifyToken: ", error);
        return error
    }
}