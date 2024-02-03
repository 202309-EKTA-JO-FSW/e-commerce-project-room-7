const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get('/', adminController.getData)
router.delete('/remove/:id', adminController.removeOneItem);
router.delete('/removeManyItems', adminController.removeManyItems);
router.get('/filter', adminController.searchItem);



module.exports = router;
