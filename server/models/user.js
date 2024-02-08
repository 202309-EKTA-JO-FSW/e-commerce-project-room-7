const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken");

require("dotenv").config();

const { SECRET_ACCESS_TOKEN } = process.env;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
<<<<<<< HEAD
  lastName: { type: String, 
    required: true, 
    minLength: 3, 
    maxLength: 20 
  },
=======
  lastName: { type: String, required: true, minLength: 3, maxLength: 20 },
>>>>>>> main
  email: {
    type: String,
    required: true,
    unique: true,
<<<<<<< HEAD
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[^\s]+@[^\s]+\.[^\s]+$/.test(value);
      },
      message: 'Invalid email address format',
    },
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

//Hashing the password
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
     return next();
  };

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

// JWT Token method.
userSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: '20m',
  });
};

module.exports = mongoose.model("users", userSchema);
=======
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: "Invalid email address format",
    },
  }, //validate email syntax
  password: {
    type: String,
    required: true,
  },
  gender: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("userModel", userSchema);
>>>>>>> main
