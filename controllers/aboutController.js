import About from "../models/About.js";


// ✅ CREATE or UPDATE (Single About)
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

    let about = await About.findOne();

    // ✅ UPDATE
    if (about) {
      about.description = description.trim();
      about.subDescription = subDescription.trim();
      about.aboutText = aboutText.trim();
      about.email = email.trim();
      about.phone = phone.trim();

      if (req.file) {
        about.image = `/uploads/${req.file.filename}`;
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
      description: description.trim(),
      subDescription: subDescription.trim(),
      aboutText: aboutText.trim(),
      email: email.trim(),
      phone: phone.trim(),
      image: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({
      success: true,
      message: "About created successfully",
      data: about,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ GET About
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: about,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ DELETE About
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }

    await About.deleteOne({ _id: about._id });

    return res.status(200).json({
      success: true,
      message: "About deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};