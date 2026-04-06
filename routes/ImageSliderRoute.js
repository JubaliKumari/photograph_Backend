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

router.post("/createImage", upload.single("image"), createImage);
router.get("/", getAllImages);
router.get("/:id", getSingleImage);
router.put("/:id", upload.single("image"), updateImage);
router.delete("/:id", deleteImage);

export default router;