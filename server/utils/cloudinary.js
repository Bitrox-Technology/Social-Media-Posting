import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
// 'fs' is file system that help to read write on the file. mainly we need a file path.

// In our file system our file are linked or unlinked
// Linked means attached and Unlinked means delete the files

const uploadOnClodinary = async (localFilePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    if (!localFilePath) return null;
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); 
    return null;
  }
};

const carouselUploadOnCloudinary = async (files) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const urls = [];

  try {
    for (const file of files) {
      const uniqueFilename = `${file.originalname}`; 
      const result = await cloudinary.uploader.upload(
        file.path,
        {
          public_id: uniqueFilename,
          resource_type: "image",
          folder: "carousel-images", 
        }
      );
      fs.unlinkSync(file.path);
      urls.push(result.secure_url);
    }
    return urls;
  } catch (error) {
    for (const file of files) {
      fs.unlinkSync(file.path);
    }
    return null;
  }
};

const singleUploadOnCloudinary = async (buffer) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const result = await cloudinary.uploader
      .upload_stream({ resource_type: "image" })
      .end(buffer);

    console.log(result);
    return result.secure_url;
  } catch (error) {
    throw new ApiError(
      500,
      `Error uploading image to Cloudinary: ${error.message}`
    );
  }
};
export {
  uploadOnClodinary,
  carouselUploadOnCloudinary,
  singleUploadOnCloudinary,
};
