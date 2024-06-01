const userRouter = require("express").Router();
const ReportControllers = require("../controllers/DailyReport");
const Formcontroller = require("../controllers/FormDataControllers");
const usercontroller = require("../controllers/userControllers");
const authmiddleware = require("../middleware/authmiddleware");

userRouter.post("/signup", usercontroller.signup);
userRouter.post("/signin", usercontroller.signin);
userRouter.get("/list", usercontroller.list);
userRouter.post("/forgot", usercontroller.forgot);
userRouter.post("/reset", usercontroller.reset);
userRouter.post("/create", Formcontroller.Create);
userRouter.get("/getData", Formcontroller.getdata);
userRouter.get("/getdailyData", Formcontroller.getdailyData);
userRouter.post("/getReportSearch", ReportControllers.SearchByReportdata);
userRouter.post("/getdailyDateSearch", Formcontroller.SearchByDateDailydata);
userRouter.get("/getItemMaster", Formcontroller.getItemMaster);
userRouter.get("/getinvoice", Formcontroller.getinvoice);
userRouter.put("/updateReceipt", Formcontroller.itemUpdate);

userRouter.put("/openingUpdate", Formcontroller.openingUpdate);
userRouter.put("/updateData", Formcontroller.updateData);
userRouter.post("/search", Formcontroller.search);
userRouter.post("/dailyData", Formcontroller.dd);
userRouter.post("/invoice", Formcontroller.invoice);
userRouter.get("/getSale", ReportControllers.getSaleData);
userRouter.get("/bank", ReportControllers.get);
userRouter.post(
  "/dailyReport",

  ReportControllers.saveReport
);
userRouter.get("/getReport", ReportControllers.get);
userRouter.put("/update", ReportControllers.update);
module.exports = userRouter;
