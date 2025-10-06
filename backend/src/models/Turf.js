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
        type: String,
        required: true,
    },
    gamesAllowed: {
        type: [String],
    },
    images: {
        type: [String]
    },
    facilities: {
        type: [String],
    },
    price: {
        morning: {
            type: Number
        },
        evening: {
            type: Number
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Turfs", turfSchema);