const mongoose = require("mongoose");

const invoiceNumSchema = new mongoose.Schema({
  OpeningBottle: Number,
  OpeningValue: Number,
  ReceiptBottle: Number,
  ReceiptValue: Number,
  TotalBottle: Number,
  TotalValue: Number,
  Date: { type: Date, default: Date.now() },
  Invoice: String,
});

const InvoiceNum = mongoose.model("InvoiceNum", invoiceNumSchema, "invoice");
module.exports = InvoiceNum;
