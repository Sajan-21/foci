const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"]
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password required"],
        minlength: 6
    },
    phone: {
        type: Number
    },
    role: {
        type: String,
        enum: ["admin", "owner", "manager", "player"],
        required: [true, "role required"],
        default: "player"
    },
    avatar: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Users", userSchema);