import LifeStyle from "../models/LifeStyle.js";

// ✅ Create LifeStyle
export const createLifeStyle = async (req, res) => {
  try {
    const { heading,description } = req.body; // ✅ FIX ADDED HERE

    if (!heading) {
      return res.status(400).json({ error: "Heading is required" });
    }
    if (!description) { // ✅ FIX ADDED HERE
      return res.status(400).json({ error: "Description is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload images" });
    }

    const imageUrls = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    );

    const newLifeStyle = new LifeStyle({
      heading,
      description, // ✅ FIX ADDED HERE

      images: imageUrls,
    });

    await newLifeStyle.save();

    res.status(201).json({
      message: "LifeStyle created successfully ✅",
      data: newLifeStyle,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All
export const getAllLifeStyles = async (req, res) => {
  try {
    const data = await LifeStyle.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete
export const deleteLifeStyle = async (req, res) => {
  try {
    const { id } = req.params;

    await LifeStyle.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};