const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");

router.get("/", customerController.getAllShopItems); //get all shop items
router.get("/filter", customerController.filterShopItems); //filter shop items
router.get("/search", customerController.serchShopItems); //search for a shop item
router.post("/:id/cart", customerController.addItemToCart); //send item id and quantity in after the cart in the request params
router.post("/:id/checkout", customerController.checkoutCustomer); //calcaulte the bill for the customer
router.get("/:id", customerController.getShopItemInfo); //get information of the item

module.exports = router;
