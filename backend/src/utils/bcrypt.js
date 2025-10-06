const bcrypt = require('bcryptjs');

exports.hashValues = (value) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hashedValue = bcrypt.hashSync(value, salt);

        if(hashedValue) {
            return hashedValue;
        }

    } catch (error) {
        console.log("error in hashValue: ", error);
        return error.message || error
    }
}

exports.compareValues = (value,hashedValue) => {
    try {
        const checkValues = bcrypt.compareSync(value, hashedValue);

        if(checkValues) {
            return true;
        }else{
            return false;
        }

    } catch (error) {
        console.log("error in compareValues: ", error);
        return error.message || error
    }
}