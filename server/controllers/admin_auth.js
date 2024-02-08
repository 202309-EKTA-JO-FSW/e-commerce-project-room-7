const userModel = require("../models/user");
const blackListModel = require("../models/blacklist");
const bcrypt = require("bcrypt");
const cookie = require('cookie');


// Sign in authentication
const signin = async (req, res) => {
   const { email } = req.body;

   try {
     const user = await userModel.findOne({ email }).select("+password");
     if (!user) {
       return res.status(401).json({ message: "Invalid email or password. Please try again with the correct credentials."});
     };

     const isPasswordValid = await bcrypt.compare(`${req.body.password}`,
     user.password);

     if (!isPasswordValid) {
       return res.status(401).json({ message: "Invalid email or password. Please try again with the correct credentials."});
     };
     
     let options = {
      maxAge: 20 * 60 * 1000, // 20 min
      httpOnly: true,
      secure: true,
      sameSite: "None",
     };

     const token = user.generateAccessJWT();
     res.cookie("SessionID", token, options);
       
     res.status(200).json({message: "You have successfully logged in."});
     res.end();
   } catch (err) {
     res.status(500).json({ message: "Internal Server Error"});
   };
};

// sign out authentication 
const signout = async (req, res) => {
    try {
      const authHeader = req.headers['cookie'];

      if (!authHeader) {
        return res.sendStatus(204);
      };

      const cookies = cookie.parse(authHeader);
      const accessToken = cookies["SessionID"];  

      if (!accessToken) {
        return res.sendStatus(401);
      };
      
      const checkIfBlackListed = await blackListModel.findOne({ token: accessToken });

      if (checkIfBlackListed) {
        return res.sendStatus(204);
      };

      const newBlackList = new blackListModel({ token: accessToken });

      await newBlackList.save();

      res.setHeader('Clear-Site-Data', '" cookies"');
      res.status(200).json({ message: 'You are logged out!'});
      res.end();
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error'});
    };
};


module.exports = {signin,
                  signout};