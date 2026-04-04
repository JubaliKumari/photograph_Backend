import express from "express";
import {
  createImage,
  getAllImages,
  getSingleImage,
  updateImage,
  deleteImage,
} from "../controllers/ImageSlider.js";

import upload from "../middleware/Upload.js";
const router = express.Router();

// ✅ specific routes first
router.post("/createImage", upload.single("image"), createImage);
router.get("/", getAllImages);

// ❗ dynamic route always last
router.get("/:id", getSingleImage);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

export default router;

