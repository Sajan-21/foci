const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"]
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        lat: {
            type: String
        },
        lng: {
            type: String
        }
    },
    gamesAllowed: {
        type: [String],
    },
    bio: {
        type: String
    },
    images: {
        type: [String]
    },
    facilities: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true
    },
    permission: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Turfs", turfSchema);