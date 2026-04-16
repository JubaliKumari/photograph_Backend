import mongoose from "mongoose";

const travellingSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Travelling = mongoose.model("Travelling", travellingSchema);

export default Travelling;