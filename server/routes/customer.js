const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");
const customerController = require("../controllers/customer");

router.get("/", isAuthenticated, customerController.getAllShopItems); //get all shop items
router.get("/filter", isAuthenticated, customerController.filterShopItems); //filter shop items
router.get("/search", isAuthenticated, customerController.serchShopItems); //search for a shop item
router.post(
  "/checkout",
  isAuthenticated,
  customerController.checkoutCustomer
  // calcaulte the bill for the customer
);
// customer auth

router.post("/signup", customerController.signup);
router.post("/signin", customerController.signin);
router.post("/signout", isAuthenticated, customerController.signout);
router.get("/orders", isAuthenticated, customerController.getOrders);
router.put("/profile", isAuthenticated, customerController.updateProfile);
router.post("/:id/cart", isAuthenticated, customerController.addItemToCart); //send item id and quantity in after the cart in the request params
router.get("/:id", isAuthenticated, customerController.getShopItemInfo); //get information of the item

module.exports = router;
