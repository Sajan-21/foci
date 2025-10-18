const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    turf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turf",
        required: [true, "Turf required"]
    },
    startingTime: {
        type: String,
        required: [true, "starting time requried"],
    },
    endingTime: {
        type: String,
        required: [true, "ending time required"],
    },
    isBooked: {
        type: Boolean,
        default: false
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    price: {
        type: Number,
        required: [true, "price required"]
    }
});

module.exports = mongoose.model("Slots", slotSchema);