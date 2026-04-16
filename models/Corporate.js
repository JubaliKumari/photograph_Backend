import mongoose from "mongoose";

const corporateSchema = new mongoose.Schema({
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

const Corporate = mongoose.model("Corporate", corporateSchema);

export default Corporate;