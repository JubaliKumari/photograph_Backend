import Image from "../models/ImageSlider.js";
import fs from "fs";


// 📤 CREATE IMAGE
export const createImage = async (req, res) => {
  try {
    const { heading, description } = req.body;

    if (!heading || !description || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newImage = await Image.create({
      heading: heading.trim(),
      description: description.trim(),
      image: `/uploads/${req.file.filename}`, // ✅ fixed
    });

    return res.status(201).json({
      success: true,
      message: "Image created successfully",
      data: newImage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating image",
      error: error.message,
    });
  }
};



// 📋 GET ALL IMAGES (with optional pagination)
export const getAllImages = async (req, res) => {
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

    const images = await Image.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message,
    });
  }
};



// 🔍 GET SINGLE IMAGE
export const getSingleImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: image,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching image",
      error: error.message,
    });
  }
};



// ✏️ UPDATE IMAGE (with image replace)
export const updateImage = async (req, res) => {
  try {
    const imageDoc = await Image.findById(req.params.id);

    if (!imageDoc) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const { heading, description } = req.body;

    if (heading) imageDoc.heading = heading.trim();
    if (description) imageDoc.description = description.trim();

    // 🧹 Replace image if new uploaded
    if (req.file) {
      // delete old image
      if (imageDoc.image) {
        try {
          fs.unlinkSync(`.${imageDoc.image}`);
        } catch (err) {
          console.log("Old image delete failed:", err.message);
        }
      }

      imageDoc.image = `/uploads/${req.file.filename}`;
    }

    await imageDoc.save();

    return res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: imageDoc,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating image",
      error: error.message,
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

    // 🧹 delete file
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
      message: "Error deleting image",
      error: error.message,
    });
  }
};