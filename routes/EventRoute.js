import express from "express";
import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/EventController.js";

import upload from "../middleware/Upload.js";

const router = express.Router();

// ✅ ONLY ONE CREATE ROUTE
router.post("/", upload.single("image"), createEvent);

// ✅ Get Events
router.get("/", getEvents);

// ✅ Delete Event
router.delete("/:id", deleteEvent);

export default router;