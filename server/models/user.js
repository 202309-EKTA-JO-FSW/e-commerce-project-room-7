const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");

const SECRET_ACCESS_TOKEN = require("../index")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName: { type: String, 
    required: true, 
    minLength: 3, 
    maxLength: 20 
  },
  email: { //validate email syntax
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true, // to ensure consistent data and avoid issues related to extra spaces.
  }, 
  password: {
    type: String,
    required: "Your password is required",
    select: false, // by default, this field should not be included when querying the database. 
    max: 25,
},
  gender: { type: String, 
           required: true 
          },
  isAdmin: { type: Boolean, 
            required: true ,
            default: false,
          },
},
{ timestamps: true });

userSchema.pre("save", (next) => {
   const user = this;

   if(!user.isModified("password"))
    return next;

   bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    };
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      };
      
      user.password = hash;
      next();
    });

   });    
});

userSchema.methods.generateAccessJWT = () => {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: '20m',
  });
};

module.exports = mongoose.model("users", userSchema);