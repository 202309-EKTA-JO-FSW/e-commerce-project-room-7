const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");
const signInController = require("../controllers/admin_auth");
router.post("/signin", signInController.signin);
// router.get('/', adminController.getData)
router.post("/add", adminController.addNewShopItem);
router.put("/update/:id", adminController.updateShopItem);
router.delete('/remove', adminController.removeOneOrManyItems);
router.get('/filter', adminController.searchItem);



module.exports = router;
