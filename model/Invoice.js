const mongoose = require("mongoose");

const invoiceReportSchema = new mongoose.Schema({
  Pos: Number,
  Cash: Number,
  Sale: Number,
  Bank: Number,
  Date: { type: Date, default: Date.now() },
  Paytm: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const InvoiceReport = mongoose.model(
  "InvoiceReport",
  dailyReportSchema,
  "dailyreport"
);
module.exports = InvoiceReport;
