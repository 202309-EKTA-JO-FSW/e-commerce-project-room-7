const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  numberOfItems: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
  shopItems: { type: [{ type: ObjectId, ref: "Shop-Item" }], default: [] },
  totalPrice: {
    type: Number,
    default: 0,
    min: 0,
    required: true,
  },
});

const orderSchema = mongoose.Schema({
  date: {
    type: Date,
    default: new Date(),
  },
  totalPrice: {
    type: Number,
    min: 0,
    required: true,
    default: 0,
  },
  numberOfItems: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },
  shopItems: { type: [{ type: ObjectId, ref: "Shop-Item" }], default: [] },
});

const customerSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address format",
    },
  }, //validate email syntax
  gender: { type: String, required: true },
  cart: { type: cartSchema, default: {} },
  orders: { type: [orderSchema], default: [] },
});

module.exports = mongoose.model("customerModel", customerSchema);
