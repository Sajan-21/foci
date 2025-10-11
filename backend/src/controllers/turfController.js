const Turf = require("../models/Turf");
const { sendResponse } = require("../utils/responseHandler");

exports.addTurf = async(req, res) => {
    try {
        const {name, location, allowedGames, bio, facilities} = req.body;
        if(!name || !location || !location.lng || !location.lat || !allowedGames) {
            return sendResponse(res, 400, false, "manditory input fields are missing");
        }
        const gamesAllowed = allowedGames.split(",");

        const owner_id = req.body._id;
        const newTurf = {
            name,
            owner_id,
            location: {
                lat: location.lat,
                lng: location.lng
            },
            gamesAllowed,
            bio: bio || "",
            facilities: facilities || "",
        }

        const addTurf = await Turf.create(newTurf);

    } catch (error) {
        console.log("error in addTurf: ", error);
        return sendResponse(res, 400, false, error.message? error.message : error);
    }
}