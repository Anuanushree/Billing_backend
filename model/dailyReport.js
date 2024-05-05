const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema({
  Pos: Number,
  Cash: Number,
  Sale: Number,
  Bank: Number,
  Date: { type: Date, default: Date.now() },
  Paytm: String,
});

const DailyReport = mongoose.model(
  "DailyReport",
  dailyReportSchema,
  "dailyreport"
);
module.exports = DailyReport;
