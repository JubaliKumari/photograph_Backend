import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
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

const Event = mongoose.model("Event", eventSchema);

export default Event;