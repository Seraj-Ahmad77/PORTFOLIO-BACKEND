import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title required"],
  },
  description: { type: String, required: [true, "description required"] },
  timeline:{
    from:{
      type:String,
      required:[true,"Timeline starting date is required."]
    },
    to:String
  }
});

export const TimeLine = mongoose.model("TimeLine", timelineSchema);
