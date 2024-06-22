const mongoose = require("mongoose");

const inwardSchema = new mongoose.Schema({
  Date: { type: Date, default: Date.now() },
  Range: String,
  Product: String,
  Description: String,
  Item_Code: Number,
  Size: Number,
  MRP_Value: Number,
  Case_Quantity: Number,
  Opening_bottle: Number,
  Receipt_bottle: Number,
  Case: Number,
  Loose: Number,
  Item_type: String,
  Quantity: Number,
  Opening_value: Number,
  Receipt_value: Number,
  Total_value: Number,
  Total_bottle: Number,
  Closing_bottle: Number,
  Sales_bottle: Number,
  Sale_value: Number,
  Closing_value: Number,
  updated: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  invoice: String,
});

const Inward = mongoose.model("Inward", inwardSchema, "inward");
module.exports = Inward;
