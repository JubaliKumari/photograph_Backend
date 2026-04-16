import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  heading: {
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

const Events = mongoose.model("Events", eventSchema);

export default Events;