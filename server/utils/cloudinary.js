import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";
import { INTERNAL_SERVER_ERROR } from "./apiResponseCode.js";


const configCloudinary = () => {
  let config = cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return config;
}
const uploadOnClodinary = async (localFilePath, folder) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    if (!localFilePath) return null;
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: folder
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


const deleteImageFromCloudinary = async (url) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const publicId = url.split("/").pop().split(".")[0];
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    throw new ApiError(INTERNAL_SERVER_ERROR,  `Error deleting image from Cloudinary, ${error}`);
  }
}

const deleteMultipleImagesFromCloudinary = async (urls) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  const publicIds = urls.map(url => url.split("/").pop().split(".")[0]);
  try {
    const response = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    throw new ApiError(INTERNAL_SERVER_ERROR, `Error deleting images from Cloudinary, ${error}`);
  }
}
export {
  uploadOnClodinary,
  carouselUploadOnCloudinary,
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary,  
};
