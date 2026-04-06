import mongoose from "mongoose";

const ImageSliderSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ImageSlider = mongoose.model("ImageSlider", ImageSliderSchema);

export default ImageSlider;