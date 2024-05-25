const mongoose = require("mongoose");

const invoiceNumSchema = new mongoose.Schema({
  Beer_size: Object,
  IMFS_sie: Object,
  Beer_Case: Number,
  IMFS_case: Number,
  Beer_total_bottle: Number,
  Beer_total_value: Number,
  IMFS_total_bottle: Number,
  IMFS_total_value: Number,
  Total_Case: Number,
  Total_Bottle: Number,
  Total_amount: Number,
  Invoice: String,
  Date: {
    type: Date,
    default: Date.now(),
  },
});

const InvoiceNum = mongoose.model("InvoiceNum", invoiceNumSchema, "invoice");
module.exports = InvoiceNum;
