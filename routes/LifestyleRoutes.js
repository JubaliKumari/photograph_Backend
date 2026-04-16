import express from "express";
import multer from "multer";

import { createLifeStyle,getAllLifeStyles,deleteLifeStyle} from "../controllers/lifestyleController.js";
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
router.post("/createLifestyle", upload.array("images", 20), createLifeStyle);
router.get("/", getAllLifeStyles);
router.delete("/:id", deleteLifeStyle);

export default router;