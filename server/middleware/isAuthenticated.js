const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokensBlackList");
module.exports = (req, res, next) => {
  redirect = "/customer/signin";
  const token = req.headers.authorization?.split(" ")[1];
  //user doesn't have token, redirect to log in screen if request is get
  if (!token) {
    if (!req.url.split("/").includes("checkout")) res.redirect(redirect);
    //if request not get show forbidden
    else return res.status(403).end();
  } else {
    //user has a token
    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
      if (err) {
        //if the token expired or any other error do this
        if (req.method === "GET") res.redirect(redirect);
        else res.status(403).end();
      } else {
        //token is valid (not expired yet)
        const isTokenBlackListed = await tokenBlackListModel.findOne({
          token: token,
        });
        if (!!isTokenBlackListed) {
          res.status(403).end();
        }
        req.user = user;
        next();
      }
    });
  }
};
