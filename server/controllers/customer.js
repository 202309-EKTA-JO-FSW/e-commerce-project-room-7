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

customerController.serchShopItems = async (req, res) => {
  const { value } = req.query;
  try {
    const searchResults = await shopItemsModel.find(
      { title: { $regex: value } },
      {}
    );
    res.status(200).json(searchResults);
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

customerController.addItemToCart = async (req, res) => {
  const { id } = req.params;
  const { customerId, quantity } = req.body;
  try {
    const requiredItem = shopItemsModel.findById(id);
    if (quantity > requiredItem.availableCount) {
      throw new Error("The available quantity is less than the requested");
    } else {
      await shopItemsModel.findByIdAndUpdate(id, {
        availableCount: this.availableCount - quantity,
      });
      await customerModel.findByIdAndUpdate(customerId, {
        $push: { "cart.shopItems": id },
        $inc: {
          "cart.numberOfItems": 1,
          "cart.totalPrice": requiredItem.price * quantity,
        },
      });
    }
    res
      .status(201)
      .json({ message: `${quantity} ${requiredItem.title} added to cart !` });
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.checkoutCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      id,
      {
        $push: {
          orders: {
            date: new Date(),
            totalPrice: "cart.totalPrice",
            numberOfItems: "cart.numberOfItems",
            shopItems: "cart.shopItems",
          },
        },
        cart: {},
      },
      { new: true }
    );

    res
      .status(201)
      .json(updatedCustomer.orders[updatedCustomer.orders.length - 1]);
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
