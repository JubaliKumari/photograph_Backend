import Image from "../models/Image.js";

// UPLOAD IMAGE
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const newImage = await Image.create({
      image: req.file.path,
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL IMAGES
export const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE IMAGE
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};