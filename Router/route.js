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
userRouter.get("/getInward", Formcontroller.getinward);
userRouter.get("/getAllData", Formcontroller.getAllData);
userRouter.get("/getAllDailyData", Formcontroller.getAllDailyData);
userRouter.delete("/deleteUser/:userId", usercontroller.deleteUser);
userRouter.delete("/delete", Formcontroller.deleteDuplicates);
userRouter.get(
  "/profile",
  authmiddleware.verifyToken,
  usercontroller.getprofile
);

userRouter.post("/create", Formcontroller.Create);
userRouter.get("/getData", authmiddleware.verifyToken, Formcontroller.getdata);
userRouter.get(
  "/getdailyData",
  authmiddleware.verifyToken,
  Formcontroller.getdailyData
);
userRouter.post(
  "/getReportSearch",
  authmiddleware.verifyToken,
  ReportControllers.SearchByReportdata
);
userRouter.post(
  "/getdailyDateSearch",
  authmiddleware.verifyToken,
  Formcontroller.SearchByDateDailydata
);
userRouter.get(
  "/getItemMaster",
  authmiddleware.verifyToken,
  Formcontroller.getItemMaster
);
userRouter.get(
  "/getinvoice",
  authmiddleware.verifyToken,
  Formcontroller.getinvoice
);
userRouter.put(
  "/updateReceipt",
  authmiddleware.verifyToken,
  Formcontroller.itemUpdate
);
userRouter.patch(
  "/updateAllReceipt",

  Formcontroller.AllitemUpdate
);
userRouter.post(
  "/getInvoiceSearch",
  authmiddleware.verifyToken,
  ReportControllers.SearchInvoice
);

userRouter.put(
  "/openingUpdate",
  authmiddleware.verifyToken,
  Formcontroller.openingUpdate
);
userRouter.put(
  "/updateData",
  authmiddleware.verifyToken,
  Formcontroller.updateData
);
userRouter.post("/search", authmiddleware.verifyToken, Formcontroller.search);
userRouter.post("/billingUpdate",  Formcontroller.dd);
userRouter.post("/invoice", authmiddleware.verifyToken, Formcontroller.invoice);

userRouter.get(
  "/getSale",
  authmiddleware.verifyToken,
  ReportControllers.getSaleData
);
userRouter.get("/bank", authmiddleware.verifyToken, ReportControllers.get);
userRouter.post(
  "/dailyReport",
  authmiddleware.verifyToken,
  ReportControllers.saveReport
);
userRouter.get("/getReport", authmiddleware.verifyToken, ReportControllers.get);
userRouter.put("/update", authmiddleware.verifyToken, ReportControllers.update);
module.exports = userRouter;
