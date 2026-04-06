import ImageSlider from "../models/ImageSlider.js";
import fs from "fs";

// 📤 CREATE
export const createImage = async (req, res) => {
  try {
    const { heading, description } = req.body;

    if (!heading?.trim() || !description?.trim() || !req.file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newImage = await ImageSlider.create({
      heading: heading.trim(),
      description: description.trim(),
      image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      success: true,
      message: "Image created successfully",
      data: newImage,
    });
  } catch (error) {
  console.error("UPLOAD ERROR:", error); // 👈 add this
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

// 📋 GET ALL
export const getAllImages = async (req, res) => {
  try {
    const images = await ImageSlider.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔍 GET SINGLE
export const getSingleImage = async (req, res) => {
  try {
    const image = await ImageSlider.findById(req.params.id);

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
      message: error.message,
    });
  }
};

// ✏️ UPDATE
export const updateImage = async (req, res) => {
  try {
    const imageDoc = await ImageSlider.findById(req.params.id);

    if (!imageDoc) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const { heading, description } = req.body;

    if (heading) imageDoc.heading = heading.trim();
    if (description) imageDoc.description = description.trim();

    if (req.file) {
      try {
        const oldFile = imageDoc.image.split("/uploads/")[1];
        fs.unlinkSync(`uploads/${oldFile}`);
      } catch (err) {
        console.log("Old image delete failed");
      }

      imageDoc.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await imageDoc.save();

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: imageDoc,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ❌ DELETE
export const deleteImage = async (req, res) => {
  try {
    const image = await ImageSlider.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    try {
      const oldFile = image.image.split("/uploads/")[1];
      fs.unlinkSync(`uploads/${oldFile}`);
    } catch (err) {
      console.log("Delete file error");
    }

    await image.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};