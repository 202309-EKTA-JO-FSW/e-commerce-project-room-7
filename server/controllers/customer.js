const customerModel = require("../models/customer");
const shopItemsModel = require("../models/shopItem");
const customerController = {};

customerController.getAllShopItems = async (req, res) => {
  try {
    const shopItems = await shopItemsModel.find({});
    res.status(200).json(shopItems);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.filterShopItems = async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  try {
    const filteringOptions = {};
    if (!!category) {
      filteringOptions.category = category;
    }
    if (!!minPrice && !!maxPrice) {
      filteringOptions.minPrice = { price: { $gte: minPrice, $lte: maxPrice } };
    }

    const filteredShopItems = await shopItemsModel.find(filteringOptions, {});
    res.status(200).json(filteredShopItems);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.getShopItemInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const itemInfo = await shopItemsModel.findById(id);
    res.status(200).json(itemInfo);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

module.exports = customerController;
