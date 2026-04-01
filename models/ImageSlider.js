import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },

    description: {   // fixed spelling
      type: String,
      required: true,
    },

    image: {
      type: String,   // store image URL or file path
      required: true,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", ImageSchema);

export default Image;