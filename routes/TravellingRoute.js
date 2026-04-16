import express from "express";
import multer from "multer";
import { createTravelling, getAllTravelling, deleteTravelling } from "../controllers/travellingController.js";

const router = express.Router();

/* Multer Setup */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
  },
});

const upload = multer({ storage });

/* Routes */
router.post(
  "/createTravelling",
  upload.single("image"), // ✅ must be "image"
  createTravelling
);
router.get("/", getAllTravelling);
router.delete("/:id", deleteTravelling);

export default router;