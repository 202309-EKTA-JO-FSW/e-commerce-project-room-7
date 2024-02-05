const express = require("express");
require("dotenv").config();
const connectToMongo = require("./db/connection");

const mongoose = require("mongoose");

//routes
const customerRoutes = require("./router/customer");

//testing
const customerModel = require("./models/customer");
const shopItemModel = require("./models/shopItem");

const app = express();
const port =
  process.env.NODE_ENV === "test"
    ? process.env.NODE_LOCAL_TEST_PORT
    : process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/customers", customerRoutes);

app.get("/", (req, res) => {
  res.status(200).json("hello");
});
app.post("/addCustomer", async (req, res) => {
  const user = {
    firstName: "julia",
    lastName: "doe",
    email: "jdoe@gmail.com",
    gender: "female",
  };
  try {
    await customerModel.create(user);
    res.status(201).json("user created successfully");
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
});
app.post("/addItem", async (req, res) => {
  const item = {
    title: "shampoo",
    image: "sau320",
    price: 7,
    availableCount: 86,
    category: ["cleaning things"],
  };
  try {
    await shopItemModel.create(item);
    res.status(201).json("item created successfully");
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
});

app.delete("/:id/deleteItem", async (req, res) => {
  try {
    await shopItemModel.findByIdAndDelete(req.params.id);
    res.status(201).json("item del successfully");
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const items = await customerModel.find({});
    res.status(201).json(items);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
});

app.get("/getItems", async (req, res) => {
  try {
    const users = await shopItemModel.find({});
    res.status(201).json(users);
  } catch (err) {
    res.status(422).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
