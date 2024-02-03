const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
  email: { type: String, required: true }, //validate email syntax
  gender: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});
