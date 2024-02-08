const itemsModel = require("../models/shopItem");
const customerModel = require("../models/customer");
const userModel = require("../models/user");

// admin add new shop item
const addNewShopItem = async (req, res) => {
  const shopItemData = req.body;
  try {
    const newShopItem = await itemsModel.create(shopItemData);
    res.status(201).json(newShopItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  };
};

// admin update shop item
const updateShopItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedShopItem = await itemsModel.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!updatedShopItem) {
      res.status(422).json({
        message: "The Shop Item you are trying to update wasn't found",
      });
    } else {
      res.json(updatedShopItem);
    }
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

// Delete one or more from an items shop
const removeOneOrManyItems = async (req, res) => {
  try {
    // Example: { ids: ['id1', 'id2', 'id3'] }
    const { ids } = req.body;
    const deleteItems = await itemsModel.deleteMany({ _id: { $in: ids } });

    if (deleteItems.deletedCount > 0) {
      res.json({ message: `${deleteItems.deletedCount} documents deleted` });
    } else {
      res.status(422).json({ message: "The Shop Item you are trying to delete wasn't found" });
    };
  } catch (error) {
    res.status(500).json(error.message);
  };
};

// Search shop items based on different properties

const searchItem = async (req, res) => {
  try {
    const foundItems = await itemsModel.find(req.query);

    if (foundItems) {
      res.json(foundItems);
    } else {
      res.status(422).json({ message: "The Shop Item you are trying to find doesn't exist" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  };
};

// admin get all customers information

const getCustomerData = async (_, res) => {
  try {
    const customers = await customerModel.find({}).populate('cart.shopItems orders.shopItems');
    res.status(200).json(customers);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

// admin get all orders

const getOrders = async (_, res) => {
  try {
    const orders = await customerModel.find({}, { orders: 1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create new admin account
const createAdminAccount = async (req, res) => {
  const newAdminData = req.body;
  try {
    const admin = await userModel.findOne({ email: req.body.email });
    if (!admin) {
      userModel.create(newAdminData);
      return res.status(201).json(newAdminData);
    } else {
      return res.status(400).json({ message: "Admin already exists" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  addNewShopItem,
  updateShopItem,
  removeOneOrManyItems,
  searchItem,
  createAdminAccount,
  getCustomerData,
  getOrders,
  createAdminAccount
};
