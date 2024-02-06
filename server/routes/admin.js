const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

//router.get("/", adminController.getData); test
router.post("/add", adminController.addNewShopItem);
router.put("/update/:id", adminController.updateShopItem);
router.delete("/remove", adminController.removeOneOrManyItems);
router.get("/filter", adminController.searchItem);
router.get("/customers", adminController.getCustomerData);
router.get("/orders", adminController.getOrders);
router.post("/new-admin", adminController.createAdminAccount);
//router.post("/addcustomer", adminController.addCustomer) test
module.exports = router;
