import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // ✅ ADD THIS

import db from "./config/db.js";
import EventRoute from "./routes/EventRoute.js";
import ImageRoutes from "./routes/ImageRoutes.js";
import AnoutRoute from "./routes/AboutRoute.js";
import userRoutes from "./routes/userRoutes.js";
import ImageSliderRoutes from "./routes/ImageSliderRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ ADD THIS (must be before routes)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Middleware
app.use(express.json());

// ✅ Static folder
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/events", EventRoute);
app.use("/api/imageRoutes", ImageRoutes);
app.use("/api/about", AnoutRoute);
app.use("/api/users", userRoutes);
app.use("/api/imageSlider", ImageSliderRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ Start server
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });