const mongoose = require("mongoose");

const dailyReportSchema = new mongoose.Schema({
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

const DailyReport = mongoose.model(
  "DailyReport",
  dailyReportSchema,
  "dailyreport"
);
module.exports = DailyReport;
