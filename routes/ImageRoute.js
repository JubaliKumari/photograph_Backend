import express from "express";
import {
  createImage,
  getAllImages,
  getSingleImage,
  updateImage,
  deleteImage,
} from "../controllers/ImageSlider.js";

const router = express.Router();

router.post("/createImage", createImage);
router.get("/", getAllImages);
router.get("/:id", getSingleImage);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

export default router;