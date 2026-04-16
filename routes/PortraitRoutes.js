import express from "express";
import multer from "multer";

import {
    createPortrait,
    getAllPortraits,
    deletePortrait, 
} from "../controllers/portraitController.js";
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
router.post("/createPortrait", upload.array("images", 20), createPortrait);
router.get("/", getAllPortraits);
router.delete("/:id", deletePortrait);

export default router;