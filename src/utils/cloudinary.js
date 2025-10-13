import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnClodinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //uploading file on cloudinary
    response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    console.log("file is uploaded on clodinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove locally saved temporary file as upload operation got failed
    return null;
  }
};
export default uploadOnClodinary;
