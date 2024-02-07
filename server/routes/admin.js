const express = require("express");

const router = express.Router();
const {verify, verifyIsAdmin} = require("../middleware/verify");

const adminController = require("../controllers/admin_crud");
const signController = require("../controllers/admin_auth");

router.post("/signin", signController.signin);
router.get('/signout', signController.signout);

router.get("/customers", verify, verifyIsAdmin, adminController.getCustomerData);
router.get("/orders", verify, verifyIsAdmin, adminController.getOrders);
router.post('/new-account' , verify, verifyIsAdmin, adminController.createAdminAccount);
router.post("/add", verify, verifyIsAdmin, adminController.addNewShopItem);
router.put("/update/:id", verify, verifyIsAdmin, adminController.updateShopItem);
router.delete('/remove', verify, verifyIsAdmin, adminController.removeOneOrManyItems);
router.get('/filter', verify, verifyIsAdmin, adminController.searchItem);


module.exports = router;


