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
    turf_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turf"
    },
    image: {
        avatar: {
            type: String,
        },
        public_id: {
            type: String
        }
    }
});

module.exports = mongoose.model("Users", userSchema);