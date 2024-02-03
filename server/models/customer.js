//embed cart
//embed order
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  numberOfItems: {
    type: number,
    default: 0,
    min: 0,
    required: true,
  },
  shopItems: [{ type: ObjectId, ref: "Shop-Item" }],
  totalPrice: {
    type: number,
    default: 0,
    min: 0,
    required: true,
  },
});

const orderSchema = mongoose.Schema({
  date: Date,
  totalPrice: {
    type: number,
    min: 0,
    required: true,
  },
  numberOfItems: {
    type: number,
    min: 0,
    required: true,
  },
  shopItems: [{ type: ObjectId, ref: "Shop-Item" }],
});

const customerSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
  email: { type: String, required: true }, //validate email syntax
  gender: { type: String, required: true },
  cart: cartSchema,
  orders: [orderSchema],
});
