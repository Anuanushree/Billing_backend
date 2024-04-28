const DailyReport = require("../model/dailyReport");
const Sale = require("../model/sale");

const ReportControllers = {
  saveReport: async (request, response) => {
    try {
      const { Pos, Cash, Sale, date, Bank } = request.body;
      const newData = new DailyReport({
        Pos,
        Cash,
        Sale,
        Bank,
      });
      await newData.save();
      response.status(200).json({ message: "Report  added successfully" });
    } catch (error) {
      console.log("Error in DailyReport ", error);
      response.json({ message: "Error in DailyReport" });
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
};
module.exports = ReportControllers;
