const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../config");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadImage = (image, imageId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      image,
      { ...opts, public_id: imageId },
      (error, result) => {
        if (result && result.secure_url) {
          return resolve(result.secure_url); 
        } else {
          return reject({ message: error.message });
        }
      }
    );
  });
};

const deleteImage = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (result && result.result === "ok") {
        return resolve(true);
      } else {
        return reject({ message: error.message });
      }
    });
  });
};

module.exports = {
  uploadImage,
  deleteImage,
};
