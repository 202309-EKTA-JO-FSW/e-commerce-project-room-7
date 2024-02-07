const userModel = require("../models/user");
const bcrypt = require("bcrypt");

const signin = async (req, res) => {
   const { email } = req.body;

   try {
     const user = await userModel.findOne({ email }).select("+password");
     if (!user) {
       return res.this.status(401).json({ message: "Invalid email or password. Please try again with the correct credentials."});
     };

     const isPasswordValid = bcrypt.compare(`${req.body.password}`,
     user.password);

     if (!isPasswordValid) {
       return res.status(401).json({ message: "Invalid email or password. Please try again with the correct credentials."});
     };
     
     let options = {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      scure: true,
      sameSite: "None",
     };

     const token = user.generateAccessJWT();
     res.cookie("SessionID", token, options);
       
     res.status(200).json({message: "You have successfully logged in."});

   } catch (err) {
     res.status(500).message({ message: "Internal Server Error"});
   };

   res.end();
};

module.exports = {signin};