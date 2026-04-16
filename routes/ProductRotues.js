import express from "express";
import multer from "multer";
import {
  createProducts,
  getAllProducts,
  deleteProduct,
} from "../controllers/productController.js";

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
router.post("/createProducts", upload.array("images", 20), createProducts);
router.get("/", getAllProducts);
router.delete("/:id", deleteProduct);

export default router;