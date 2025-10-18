const Turf = require("../models/Turf");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
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
        if(addTurf) {
            return sendResponse(res, 200, true, "turf added succesfully");
        }

    } catch (error) {
        console.log("error in addTurf: ", error);
        return sendResponse(res, 500, false, error.message || error);
    }
};

exports.addImages = async (req, res) => {
  try {
    const {turfId} = req.body.turfId;
    if(!turfId) {
        return sendResponse(res, 400, false, "turf_id required");
    }

    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, "images required");
    }

    const results = await uploadToCloudinary(req.files, "Turf");

    const images = results.map(img => ({
      imgUrl: img.secure_url,
      public_id: img.public_id
    }));

    const updateImages = await Turf.findByIdAndUpdate(turfId, { $push: { images: { $each: images } } });
    if(updateImages) {
        return sendResponse(res, 200, true, "images updated successfully");
    }

    return sendResponse(res, 200, true, "images uploaded successfully", images);
  } catch (error) {
    console.log("error in addImages: ", error);
    return sendResponse(res, 500, false, error.message || error);
  }
};