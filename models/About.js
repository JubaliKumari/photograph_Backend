import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
     description: {
      type: String,
      required: [true, "Description is required"],
    },
    subDescription: {
      type: String,
      required: [true, "Sub description is required"],
    },
    aboutText: {
      type: String,
      required: [true, "About text is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("About", aboutSchema);