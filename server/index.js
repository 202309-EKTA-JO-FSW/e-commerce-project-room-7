const express = require("express");
require("dotenv").config();
const connectToMongo = require("./db/connection");

//routes
const customerRoutes = require("./routes/customer");
const adminRoutes = require("./routes/admin");

const users = require("./models/user");

const app = express();
const port =
  process.env.NODE_ENV === "test"
    ? process.env.NODE_LOCAL_TEST_PORT
    : process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/getCustomers", async (req, res) => {
  const cust = await users.find({});
  res.json(cust);
});
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});

module.exports = app;
