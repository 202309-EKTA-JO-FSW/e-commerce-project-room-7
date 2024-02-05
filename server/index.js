const express = require("express");
const customerRoutes = require("./router/customer");
require("dotenv").config();

const connectToMongo = require("./db/connection");
const adminRoutes = require('./routes/admin');

const app = express();
const port =
  process.env.NODE_ENV === "test"
    ? process.env.NODE_LOCAL_TEST_PORT
    : process.env.NODE_LOCAL_PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//routers
app.use("/admin", adminRoutes)
app.use("/customers");


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectToMongo();
});


module.exports = app;
