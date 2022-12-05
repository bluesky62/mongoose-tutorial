// init code
const mongoose = require("mongoose");
const assert = require("assert");

const db_url = process.env.DB_URL;

//connection code

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
