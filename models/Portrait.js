import mongoose from "mongoose";

const portraitSchema = new mongoose.Schema({
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

const Portrait = mongoose.model("Portrait", portraitSchema);

export default Portrait;