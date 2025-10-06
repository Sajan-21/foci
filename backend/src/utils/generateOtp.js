exports.generateOTP = (length) => {
    try {
        let otp = "";
        for(let i = 0; i < length; i++ ) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    } catch (error) {
        console.log("error in generateOTP: ", error);
        return error.message || error;
    }
}