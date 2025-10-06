const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongoConnect = async() => {
    try {
        const mongoConnection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("database connection established");
    } catch (error) {
        console.log("error from mongoConnect: ", error);
    }
}

module.exports = mongoConnect;