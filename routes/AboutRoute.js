import express from "express";
import {
  createOrUpdateAbout,
  getAbout,
  deleteAbout,
} from "../controllers/aboutController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/about", upload.single("image"), createOrUpdateAbout);
router.get("/about", getAbout);
router.delete("/about", deleteAbout);

export default router;

