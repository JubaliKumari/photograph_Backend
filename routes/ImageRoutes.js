import express from "express";
import {
  uploadImage,
  getImages,
  deleteImage,
} from "../controllers/imageController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/", getImages);
router.delete("/:id", deleteImage);

export default router;