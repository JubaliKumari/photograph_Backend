// import Image from "../models/Image.js";
import Image from "../models/ImageSlider.js";
import fs from "fs";


// 📤 UPLOAD IMAGE
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const newImage = await Image.create({
      image: `/uploads/${req.file.filename}`, // ✅ fixed path
    });

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: newImage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 📋 GET IMAGES (with optional pagination)
export const getImages = async (req, res) => {
  try {
    let { page, limit } = req.query;

    if (page && limit) {
      page = parseInt(page);
      limit = parseInt(limit);

      const images = await Image.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Image.countDocuments();

      return res.status(200).json({
        success: true,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        data: images,
      });
    }

    // fallback → return all
    const images = await Image.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: images,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ❌ DELETE IMAGE (with file cleanup)
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // 🧹 delete file from server
    if (image.image) {
      try {
        fs.unlinkSync(`.${image.image}`);
      } catch (err) {
        console.log("File delete error:", err.message);
      }
    }

    await image.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};