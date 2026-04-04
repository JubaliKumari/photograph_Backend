import express from "express";
import dotenv from "dotenv";
import path from "path";

import db from "./config/db.js";
import ImageRoute from "./routes/ImageRoute.js";
import EventRoute from "./routes/EventRoute.js";
import ImageRoutes from "./routes/ImageRoutes.js";
import AnoutRoute from "./routes/AboutRoute.js";

// ✅ Load env first
dotenv.config();

// ✅ Create app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());

// ✅ Static folder for images
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/images", ImageRoute);
app.use("/api/events", EventRoute);
app.use("/api/imageRoutes", ImageRoutes);
app.use("/api/about", AnoutRoute);
app.use("/api/users", userRoutes);


// ✅ Test route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ✅ Start server after DB connection
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });