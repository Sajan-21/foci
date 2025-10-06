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