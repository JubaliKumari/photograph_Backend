import Event from "../models/Event.js";
import fs from "fs";


// ✅ CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const { heading } = req.body;

    if (!heading || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Heading and image are required",
      });
    }

    const event = await Event.create({
      heading: heading.trim(),
      image: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ GET EVENTS (Pagination + Latest First)
export const getEvents = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const events = await Event.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Event.countDocuments();

    return res.status(200).json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: events,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ✅ GET SINGLE EVENT (optional but useful)
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ❌ DELETE EVENT (with image cleanup)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 🧹 Delete image file (optional)
    if (event.image) {
      try {
        fs.unlinkSync(`.${event.image}`);
      } catch (err) {
        console.log("Image delete failed:", err.message);
      }
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};