import mongoose from "mongoose";

const exploreWorkSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "Heading is required"],
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

export default mongoose.model("ExploreWork", exploreWorkSchema);