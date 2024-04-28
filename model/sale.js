const mongoose = require("mongoose");

const SaleDataSchema = new mongoose.Schema({
  Date: {
    type: Date,
    default: Date.now(),
  },

  Product: String,
  Closing_value: Number,
  Total: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Sale = mongoose.model("Sale", SaleDataSchema, "sale");
module.exports = Sale;
