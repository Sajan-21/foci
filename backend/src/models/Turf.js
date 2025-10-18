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
    images: [{
        img_url: {
            type: String,
        },
        public_id: {
            type: String
        }
    }],
    facilities: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true
    },
    slots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Slot",
        default: null
    }],
    permission: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Turfs", turfSchema);