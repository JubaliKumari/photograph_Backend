
import Image from "../models/ImageSlider.js";
/**
 * @desc   Create Image
 * @route  POST /api/images
 */
export const createImage = async (req, res) => {
  try {
    const { heading, description, image } = req.body;

    if (!heading || !description || !image) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newImage = await Image.create({
      heading,
      description,
      image,
    });

    if(!newImage){
        return res.status(400).json({
            success:false,
            massage:"Image Not Created",
        })
    }
    res.status(201).json({
      success: true,
      message: "Image created successfully",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating image",
      error: error.message,
    });
  }
};

/**
 * @desc   Get All Images
 * @route  GET /api/images
 */
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message,
    });
  }
};

/**
 * @desc   Get Single Image
 * @route  GET /api/images/:id
 */
export const getSingleImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      data: image,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching image",
      error: error.message,
    });
  }
};

/**
 * @desc   Update Image
 * @route  PUT /api/images/:id
 */
export const updateImage = async (req, res) => {
  try {
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating image",
      error: error.message,
    });
  }
};

/**
 * @desc   Delete Image
 * @route  DELETE /api/images/:id
 */
export const deleteImage = async (req, res) => {
  try {
    const deletedImage = await Image.findByIdAndDelete(req.params.id);

    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
};