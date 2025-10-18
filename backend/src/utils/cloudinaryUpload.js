const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = async (fileBuffers, folderName = "uploads") => {
    try {
        const uploadPromises = fileBuffers.map(file => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ folder: folderName }, (error, result) => {
                        if (result) {
                            resolve(result);
                        }else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(file).pipe(stream);
            });
        });

        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.log("error in uploadToCloudinary: ", error);
        return error
    }
};

module.exports = { upload, uploadToCloudinary };