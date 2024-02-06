const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    defalut: "no image provided",
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  availableCount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: [String],
    required: true,
    validate: (v) => Array.isArray(v) && v.length > 0,
  },
});

module.exports = mongoose.model("Shop-Item", shopItemSchema);
