import Portrait from "../models/Portrait.js";

// ✅ Create Portrait
export const createPortrait = async (req, res) => {
  try {
    const { heading } = req.body;

    if (!heading) {
      return res.status(400).json({ error: "Heading is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Please upload images" });
    }

    const imageUrls = req.files.map(
      (file) => `http://localhost:5000/uploads/${file.filename}`
    );

    const newPortrait = new Portrait({
      heading,
      images: imageUrls,
    });

    await newPortrait.save();

    res.status(201).json({
      message: "Portrait created successfully ✅",
      data: newPortrait,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All
export const getAllPortraits = async (req, res) => {
  try {
    const data = await Portrait.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete
export const deletePortrait = async (req, res) => {
  try {
    const { id } = req.params;

    await Portrait.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};