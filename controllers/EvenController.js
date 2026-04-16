import Event from "../models/Event.js";

// ✅ Create Event
export const createEvent = async (req, res) => {
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

    const newEvent = new Event({
      heading,
      images: imageUrls,
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully ✅",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All
export const getAllEvents = async (req, res) => {
  try {
    const data = await Event.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await Event.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully ❌" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};