const mongoose = require("mongoose");

const shopItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    // type:,// type to be decieded later on
    required: true,
    // defalut: //default img to be decided
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
  },
});

module.exports = mongoose.model("Shop-Item", shopItemSchema);
