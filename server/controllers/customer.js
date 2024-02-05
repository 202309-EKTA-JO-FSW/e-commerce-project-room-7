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
      filteringOptions.price = { $gte: minPrice, $lte: maxPrice };
    } else if (!!maxPrice) {
      filteringOptions.price = { $lte: maxPrice };
    } else if (!!minPrice) {
      filteringOptions.price = { $gte: minPrice };
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
    const requiredItem = await shopItemsModel.findById(id);
    if (quantity > requiredItem.availableCount) {
      throw new Error("The available quantity is less than the requested");
    } else {
      const customerExists = await customerModel.findById(customerId);
      if (!!!customerExists) throw new Error("Customer doesn't exist");
      await customerModel.findByIdAndUpdate(customerId, {
        $push: { "cart.shopItems": id },
        $inc: {
          "cart.numberOfItems": quantity,
          "cart.totalPrice": requiredItem.price * quantity,
        },
      });
      await shopItemsModel.findByIdAndUpdate(id, {
        availableCount: +requiredItem.availableCount - +quantity,
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
    const currentCustomer = await customerModel.findById(id);
    if (!!!currentCustomer) throw new Error("customer doesn't exist");
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      id,
      {
        $push: {
          orders: {
            date: new Date().toUTCString(),
            totalPrice: currentCustomer.cart.totalPrice,
            numberOfItems: currentCustomer.cart.numberOfItems,
            shopItems: currentCustomer.cart.shopItems,
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
    if (!itemInfo) throw new Error("item doesn't exist!");
    res.status(200).json(itemInfo);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

module.exports = customerController;
