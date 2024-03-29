const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const userModel = require("../models/user");
const customerModel = require("../models/customer");
const shopItemsModel = require("../models/shopItem");
const tokenBlackListModel = require("../models/tokensBlackList");
const customerController = {};

async function getCustomerId(userId) {
  const user = await userModel.findById(userId);
  const customer = await customerModel.findOne({ email: user.email });
  return customer._id;
}

customerController.getAllShopItems = async (req, res) => {
  try {
    if (req.user.isAdmin) res.status(403).end();
    const shopItems = await shopItemsModel.find({});
    res.status(200).json(shopItems);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.serchShopItems = async (req, res) => {
  if (req.user.isAdmin) res.status(403).end();
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
  if (req.user.isAdmin) res.status(403).end();
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
  if (req.user.isAdmin) res.status(403).end();
  const { id } = req.params;
  const { quantity } = req.body;
  const { userId } = req.user;
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) res.status(403).end();
    const requiredItem = await shopItemsModel.findById(id);
    if (quantity > requiredItem.availableCount) {
      throw new Error("The available quantity is less than the requested");
    } else {
      const customerId = await getCustomerId(userId);
      const customerExists = await customerModel.findById(customerId);
      if (!!!customerExists) throw new Error("user doesn't exist");
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
  if (req.user.isAdmin) res.status(403).end();
  const customerId = await getCustomerId(req.user.userId);
  try {
    const currentCustomer = await customerModel.findById(customerId);
    if (!!!currentCustomer) throw new Error("customer doesn't exist");
    const updatedCustomer = await customerModel.findByIdAndUpdate(
      customerId,
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
  if (req.user.isAdmin) res.status(403).end();

  const { id } = req.params;
  try {
    const itemInfo = await shopItemsModel.findById(id);
    if (!itemInfo) throw new Error("item doesn't exist!");
    res.status(200).json(itemInfo);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.getOrders = async (req, res) => {
  if (req.user.isAdmin) res.status(403).end();
  const customerId = await getCustomerId(req.user.userId);
  const customer = await customerModel.findById(customerId);
  res.status(200).json(customer.orders);
};

customerController.updateProfile = async (req, res) => {
  if (req.user.isAdmin) res.status(403).end();
  const updatedInfo = req.body;
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
  }
  const customerId = await getCustomerId(req.user.userId);
  const updatedCustomer = await customerModel.findByIdAndUpdate(
    customerId,
    updatedInfo,
    { new: true }
  );
  await userModel.findByIdAndUpdate(req.user.userId, updatedInfo);
  res.json(updatedCustomer);
};

//customer auth
customerController.signup = async (req, res) => {
  //check if customer exits already
  try {
    const userExists = await userModel.findOne(req.body, {});
    if (!!userExists) throw new Error("user already exists!");
    const { firstName, lastName, email, gender, password, password2 } =
      req.body;
    //validate and create user entries
    if (password2 !== password) throw new Error("passwords doesn't match");
    const passwordChecker = new passwordValidator();
    //password validation schema
    passwordChecker
      .is()
      .min(6)
      .is()
      .max(50)
      .has()
      .uppercase(1)
      .has()
      .lowercase(1)
      .has()
      .not()
      .spaces()
      .has()
      .digits(1)
      .has()
      .symbols(1);

    //validate password
    const isPasswordValid = passwordChecker.validate(password);
    if (!isPasswordValid)
      throw new Error(passwordChecker.validate(password, { details: true }));
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create the new document for the user
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      gender: gender,
    };
    await userModel.create(userData);
    await customerModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      gender: gender,
    });
    //give customer token
    const userDataWithId = await userModel.find(userData);
    const tokenContent = {
      userId: userDataWithId._id,
      isAdmin: userDataWithId.isAdmin,
    };
    const accessToken = jwt.sign(tokenContent, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ accessToken: accessToken });
    //redirect user to destination
    res.redirect("/customer/");
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.signin = async (req, res) => {
  // check customer credintials
  if (!req.body) res.status(403).end();
  const { email, password, rememberMe } = req.body;
  try {
    const userExists = await userModel.findOne({ email: email }, {});
    if (!!!userExists) throw new Error("user doesn't exist");
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExists.password
    );
    if (!isPasswordCorrect)
      throw new Error("username or password is incorrect!");
    //give token
    const tokenContent = {
      userId: userExists._id,
      isAdmin: userExists.isAdmin,
    };
    const accessToken = jwt.sign(tokenContent, process.env.SECRET_KEY, {
      expiresIn: rememberMe ? "7d" : "1h",
    });
    //redirects user to another page and send token
    res.json({ accessToken: accessToken });
    res.redirect("/customer/");
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
};

customerController.signout = async (req, res) => {
  const token = await req.headers.authorization.split(" ")[1];
  await tokenBlackListModel.create({ token: token });
  res.redirect("/customer/signin");
};

module.exports = customerController;
