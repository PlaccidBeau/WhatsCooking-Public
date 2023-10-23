const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const secret = require("../secret");
cloudinary.config({
  cloud_name: secret.CLOUDINARY_CLOUD_NAME,
  api_key: secret.CLOUDINARY_KEY,
  api_secret: secret.ClOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Recipe",
    allowed_Formats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
