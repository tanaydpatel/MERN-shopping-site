const mongoose = require("mongoose");

const { Schema } = mongoose;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      maxlength: 32,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Catgory", categorySchema);
