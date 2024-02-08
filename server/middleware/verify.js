//To determine if a session is valid or not
// For security purposes, it must do that on every request to a protected route.

const userModel = require("../models/user");
const blackListModel = require("../models/blacklist");
const jwt = require("jsonwebtoken");
const cookie = require('cookie');

require("dotenv").config();
const { SECRET_ACCESS_TOKEN } = process.env;

const verify = async (req, res, next) => {
   try {
     const authHeader = req.headers["cookie"];

     if(!authHeader){
       return res.sendStatus(401);
     };
     const cookies = cookie.parse(authHeader);
     const accessToken = cookies["SessionID"];  

     if (!accessToken) {
      return res.sendStatus(401);
    };
    
    const checkIfBlackListed = await blackListModel.findOne({ token:  accessToken});

    if (checkIfBlackListed) {
      return res.status(401).json({ message: 'This session has expired. Please login'})
    }

    jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
       if (err) {
         return res.status(401).json({ message: "This session has expired. Please login" });
       };

       const { id } = decoded;
       const user = await userModel.findById(id);
       const { password, ...data } = user._doc;
       req.user = data;
       next();
     });
   } catch (err) {
      res.status(500).json({ message: "Internal Server Error"})
   };
};

const verifyIsAdmin = (req, res, next) => {
  try {
    const user = req.user;
    const { isAdmin } = user;

    if (!isAdmin) {
      return res.status(401).json({ message: "You are not authorized to view this page."});
    };
    next();
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error"});
  };
};

module.exports = {verify,
                  verifyIsAdmin};