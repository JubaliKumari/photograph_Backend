import About from "../models/About.js";

// ✅ CREATE or UPDATE About (Single Record)
export const createOrUpdateAbout = async (req, res) => {
  try {
    const { description, subDescription, aboutText, email, phone } = req.body;

    // 🔴 Validation
    if (!description || !subDescription || !aboutText || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing About (only one record)
    let about = await About.findOne();

    // ✅ UPDATE
    if (about) {
      about.description = description;
      about.subDescription = subDescription;
      about.aboutText = aboutText;
      about.email = email;
      about.phone = phone;

      // If new image uploaded
      if (req.file) {
        about.image = req.file.filename;
      }

      await about.save();

      return res.status(200).json({
        success: true,
        message: "About updated successfully",
        data: about,
      });
    }

    // ✅ CREATE
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    about = await About.create({
      description,
      subDescription,
      aboutText,
      email,
      phone,
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "About created successfully",
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET About
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE About (optional)
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    await about.deleteOne();

    res.status(200).json({
      success: true,
      message: "About deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};