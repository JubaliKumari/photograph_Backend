import express from "express";
import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/eventController.js";

import upload from "../middleware/Upload.js";
const router = express.Router();

// Create Event
router.post("/events", upload.single("image"), createEvent);

// Get Events
router.get("/events", getEvents);

// Delete Event
router.delete("/events/:id", deleteEvent);

export default router;