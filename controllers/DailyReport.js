const { now } = require("mongoose");
const DailyReport = require("../model/dailyReport");
const Sale = require("../model/sale");

const ReportControllers = {
  saveReport: async (request, response) => {
    try {
      const { Pos, Cash, Sale, Bank, Paytm } = request.body; // Assuming DateTime is included in the request body
      const dateObject = new Date();

      // Extracting date components
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1; // Month is zero-indexed, so we add 1
      const day = dateObject.getDate();

      // Creating a date string in the format "YYYY-MM-DD"
      const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      let existingReport = await DailyReport.findOne({ Date: dateString }); // Checking if a report with the same date exists

      if (existingReport) {
        // If a report with the same date exists, update its data
        existingReport.Pos = Pos;
        existingReport.Cash = Cash;
        existingReport.Sale = Sale;
        existingReport.Bank = Bank;
        existingReport.Paytm = Paytm;
        await existingReport.save();
        response.status(200).json({ message: "Report updated successfully" });
      } else {
        // If no report with the same date exists, save a new report
        const newData = new DailyReport({
          Pos,
          Cash,
          Sale,
          Bank,
          Paytm,
          Date: dateString, // Assuming Date is a field in the DailyReport schema
        });
        await newData.save();
        response.status(200).json({ message: "Report added successfully" });
      }
    } catch (error) {
      console.log("Error in saveReport ", error);
      response.status(500).json({ message: "Error in saveReport" });
    }
  },
  get: async (request, response) => {
    try {
      const data = await DailyReport.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  update: async (request, response) => {
    try {
      const Data = request.body;
      const searchId = await DailyReport.findByIdAndUpdate(Data.id, {
        Pos: Data.Pos,
        Bank: Data.Bank,
        Sale: Data.Sale,
        Cash: Data.Cash,
      });
      await searchId.save();

      response.json({ message: "case updated successfully" });
    } catch (error) {
      response.json({ message: "Error in updating case backend " });
      console.log("Error in updating case backend :", error);
    }
  },
  getSaleData: async (request, response) => {
    try {
      const data = await Sale.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  SearchByReportdata: async (req, res) => {
    try {
      const { dateSearch } = req.body; // Assuming dateSearch contains fromDate and toDate
      console.log(dateSearch);
      // Search for daily data within the specified date range
      const existingData = await DailyReport.find({
        Date: {
          $gte: dateSearch.fromDate, // Greater than or equal to the start of the date
          $lte: dateSearch.toDate, // Less than the end of the date
        },
      });

      res.json(existingData);
    } catch (error) {
      console.error("Error searching daily data by date range:", error);
      res.status(500).json({
        message: "Error in searching daily data by date range",
        error: error.message,
      });
    }
  },
};
module.exports = ReportControllers;
