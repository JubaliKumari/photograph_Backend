import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';
import ImageRoute from './routes/ImageRoute.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use('/api',ImageRoute);
// Test route
app.get('/', (req, res) => {
    res.send('API Running 🚀');
});

// Connect to DB first, then start server
db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to DB", err);
  });