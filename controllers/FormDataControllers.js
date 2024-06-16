const User = require("../model/user");
const FormData = require("../model/FormData");
const { request, response } = require("express");
const DailyReport = require("../model/dailyReport");
const Inward = require("../model/Invade");
const DailyData = require("../model/dailydata");
const Sale = require("../model/sale");
const { parse } = require("dotenv");
const InvoiceNum = require("../model/invoiceNum");

const Formcontroller = {
  Create: async (request, response) => {
    try {
      const { formData } = request.body;
      // const userId = request.userId;
      // const user = await User.findById(userId);
      var Quantity = 0;
      console.log(formData);
      if (formData.Size == 650 || formData.Size == 750) {
        Quantity = 12;
      } else if (
        formData.Size == 375 ||
        formData.Size == 500 ||
        formData.Size == 325
      ) {
        Quantity = 24;
      } else if (formData.Size == 180) {
        Quantity = 48;
      } else if (formData.Size == 1000) {
        Quantity = 9;
      }
      console.log(Quantity, "drtyui");
      var totalValue =
        formData.MRP_Value * formData.Opening_bottle +
        formData.MRP_Value * formData.Receipt_bottle;
      // let closingBottle = formData.Case * Quantity + formData.Loose;
      // let totalBottle = formData.Opening_bottle + formData.Receipt_bottle;
      // let salesBottle = totalBottle - closingBottle;
      // let salesvalues = salesBottle * formData.MRP_Value;

      const addData = new FormData({
        // Date: formData.date,
        Range: formData.Range,
        Product: formData.Product,
        Description: formData.Description,
        Item_Code: formData.Item_Code,
        Case_Quantity: formData.Case_Quantity,
        MRP_Value: formData.MRP_Value,
        Size: formData.Size,
        Item_type: formData.Item_type,
        Receipt_bottle: formData.Receipt_bottle,
        Opening_bottle: formData.Opening_bottle,
        Quantity: Quantity,
        Opening_value: formData.MRP_Value * formData.Opening_bottle,
        Receipt_value: formData.MRP_Value * formData.Receipt_bottle,
        Total_value: totalValue,
      });
      console.log(addData);
      const newdata = await addData.save();
      const newInward = new Inward({
        // ...addData,
        Date: formData.date,
        Range: formData.Range,
        Product: formData.Product,
        Description: formData.Description,
        Item_Code: formData.Item_Code,
        Case_Quantity: formData.Case_Quantity,
        MRP_Value: formData.MRP_Value,
        Size: formData.Size,
        Item_type: formData.Item_type,
        Receipt_bottle: formData.Receipt_bottle,
        Opening_bottle: formData.Opening_bottle,
        Quantity: Quantity,
        Opening_value: formData.MRP_Value * formData.Opening_bottle,
        Receipt_value: formData.MRP_Value * formData.Receipt_bottle,
        Total_value: totalValue,
      });

      await newInward.save();
      response.status(200).json({ message: "data saved successfully" });
    } catch (error) {
      console.log("error in save Form data :", error);
      response.send(error);
    }
  },

  getdata: async (request, response) => {
    try {
      const data = await FormData.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  itemUpdate: async (request, response) => {
    try {
      const data = request.body;
      console.log(data.OpeningBottle);
      // const Getdata = await Inward.findById(data.id);
      // const formUpdate = await FormData.findOne({ Item_Code: data.itemCode });
      // console.log(formUpdate);
      var totalValue =
        parseInt(data.editMRP) * parseInt(data.OpeningBottle) +
        parseInt(data.editMRP) * parseInt(data.ReceiptBottle);
      const searchId = await FormData.findByIdAndUpdate(data.id, {
        Range: data.ranageEdit,
        Description: data.desciption,
        Receipt_bottle: parseInt(data.ReceiptBottle),
        Opening_bottle: parseInt(data.OpeningBottle),
        Case: null,
        Total_bottle:
          parseInt(data.ReceiptBottle) + parseInt(data.OpeningBottle),
        Loose: null,
        Receipt_value: parseInt(data.editMRP) * parseInt(data.ReceiptBottle),
        Opening_value: parseInt(data.editMRP) * parseInt(data.OpeningBottle),
        Total_value: totalValue,
        updatedAt: Date.now(),
        // invoice: data.invoice,
      });
      await searchId.save();

      response.json({ message: "case updated successfully" });
    } catch (error) {
      response.json({ message: "Error in updating case backend " });
      console.log("Error in updating case backend :", error);
    }
  },

  // invoice: async (request, response) => {
  //   try {
  //     const data = request.body;
  //     const itemTypeWiseTotal = {};
  //     data.formDetails.forEach((entry) => {
  //       const { Item_type, Size, Total_bottle } = entry;
  //       if (!itemTypeWiseTotal[Item_type]) {
  //         itemTypeWiseTotal[Item_type] = {};
  //       }
  //       if (!itemTypeWiseTotal[Item_type][Size]) {
  //         itemTypeWiseTotal[Item_type][Size] = 0;
  //       }
  //       itemTypeWiseTotal[Item_type][Size] += Total_bottle;
  //     });

  //     // Log the result
  //     console.log("Item Type Wise Total:", itemTypeWiseTotal);
  //     let totalBeerQuantity = 0;
  //     let totalIFSCQuantity = 0;
  //     let totalBeerbottle = 0;
  //     let totalBeerprice = 0;
  //     let totalIMFsbottle = 0;
  //     let totalIMFsprice = 0;
  //     data.formDetails.forEach((item) => {
  //       // Check the type of sale (beer or IFSC) and update the corresponding total quantity
  //       if (item.Item_type === "Beer_sale") {
  //         totalBeerbottle += item.Total_bottle;
  //         totalBeerprice += item.Total_value;
  //       } else if (item.Item_type === "IMFS_sale") {
  //         totalIMFsbottle += item.Total_bottle;
  //         totalIMFsprice += item.Total_value;
  //       }
  //     });

  //     data.formDetails.forEach((item) => {
  //       // Check the type of sale (beer or IFSC) and update the corresponding total quantity
  //       if (item.Item_type === "Beer_sale") {
  //         totalBeerQuantity += item.Quantity;
  //       } else if (item.Item_type === "IMFS_sale") {
  //         totalIFSCQuantity += item.Quantity;
  //       }
  //     });

  //     console.log(
  //       "Total quantity for beer sales:",
  //       totalBeerQuantity,
  //       totalBeerbottle,
  //       totalBeerprice
  //     );
  //     console.log(
  //       "Total quantity for IFSC sales:",
  //       totalIFSCQuantity,
  //       totalIMFsbottle,
  //       totalIMFsprice
  //     );
  //     const dateObject = new Date();

  //     // Extracting date components
  //     const year = dateObject.getFullYear();
  //     const month = dateObject.getMonth() + 1; // Month is zero-indexed, so we add 1
  //     const day = dateObject.getDate();

  //     // Creating a date string in the format "YYYY-MM-DD"
  //     const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
  //       .toString()
  //       .padStart(2, "0")}`;

  //     let existingReport = await DailyReport.findOne({ Date: dateString }); // Checking if a report with the same date exists
  //     if (existingReport) {
  //       (existingReport.Beer_size = itemTypeWiseTotal.Beer_sale),
  //         (existingReport.IMFS_sie = itemTypeWiseTotal.IMFS_sale),
  //         (existingReport.Beer_Case = totalBeerQuantity),
  //         (existingReport.IMFS_case = totalIFSCQuantity),
  //         (existingReport.Beer_total_bottle = totalBeerbottle),
  //         (existingReport.Beer_total_value = totalBeerprice),
  //         (existingReport.IMFS_total_bottle = totalIMFsbottle),
  //         (existingReport.IMFS_total_value = totalIMFsprice),
  //         (existingReport.Total_Case = totalBeerQuantity + totalIFSCQuantity),
  //         (existingReport.Total_Bottle = totalBeerbottle + totalIMFsbottle),
  //         (existingReport.Total_amount = totalBeerprice + totalIMFsprice),
  //         (existingReport.Invoice = data.invoice),
  //         await existingReport.save();
  //       response.status(200).json({ message: "Report updated successfully" });
  //     } else {
  //       const newData = new InvoiceNum({
  //         Beer_size: itemTypeWiseTotal.Beer_sale,
  //         IMFS_sie: itemTypeWiseTotal.IMFS_sale,
  //         Beer_Case: totalBeerQuantity,
  //         IMFS_case: totalIFSCQuantity,
  //         Beer_total_bottle: totalBeerbottle,
  //         Beer_total_value: totalBeerprice,
  //         IMFS_total_bottle: totalIMFsbottle,
  //         IMFS_total_value: totalIMFsprice,
  //         Total_Case: totalBeerQuantity + totalIFSCQuantity,
  //         Total_Bottle: totalBeerbottle + totalIMFsbottle,
  //         Total_amount: totalBeerprice + totalIMFsprice,
  //         Invoice: data.invoice,
  //       });

  //       await newData.save();

  //       response
  //         .status(200)
  //         .json({ message: "data saved successfully", newData });
  //     }
  //   } catch (error) {
  //     console.log("error in save invoice data :", error);
  //     response.send(error);
  //   }
  // },
  invoice: async (request, response) => {
    try {
      const data = request.body;
      const itemTypeWiseTotal = {};
      data.formDetails.forEach((entry) => {
        const { Item_type, Size, Receipt_bottle = 0 } = entry;
        if (!itemTypeWiseTotal[Item_type]) {
          itemTypeWiseTotal[Item_type] = {};
        }
        if (!itemTypeWiseTotal[Item_type][Size]) {
          itemTypeWiseTotal[Item_type][Size] = 0;
        }
        itemTypeWiseTotal[Item_type][Size] += Receipt_bottle;
      });

      let totalBeerQuantity = 0;
      let totalIFSCQuantity = 0;
      let totalBeerbottle = 0;
      let totalBeerprice = 0;
      let totalIMFsbottle = 0;
      let totalIMFsprice = 0;
      data.formDetails.forEach((item) => {
        const { Item_type, Receipt_bottle = 0, Receipt_value = 0 } = item;
        if (Item_type === "Beer_sale") {
          totalBeerbottle += Receipt_bottle;
          totalBeerprice += Receipt_value;
        } else if (Item_type === "IMFS_sale") {
          totalIMFsbottle += Receipt_bottle;
          totalIMFsprice += Receipt_value;
        }
      });

      data.formDetails.forEach((item) => {
        const { Item_type, Quantity, Receipt_bottle } = item;
        if (Item_type === "Beer_sale") {
          var val = Math.round(Receipt_bottle / Quantity);

          totalBeerQuantity += val;
        } else if (Item_type === "IMFS_sale") {
          var val1 = Math.round(Receipt_bottle / Quantity);
          totalIFSCQuantity += val1;
        }
      });

      const dateObject = new Date();
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      // let existingReport = await InvoiceNum.findOne({ Date: dateString });
      // console.log(existingReport);

      for (const d of data.formDetails) {
        const existingReport = await InvoiceNum.findOne({
          Date: {
            $gte: new Date(dateString), // Greater than or equal to the start of the date
            $lt: new Date(dateString).setHours(23, 59, 59, 999), // Less than the end of the date
          },
        });
        // console.log(existingData);

        if (existingReport) {
          existingReport.Beer_size = itemTypeWiseTotal.Beer_sale;
          existingReport.IMFS_sie = itemTypeWiseTotal.IMFS_sale;
          existingReport.Beer_Case = totalBeerQuantity;
          existingReport.IMFS_case = totalIFSCQuantity;
          existingReport.Beer_total_bottle = totalBeerbottle;
          existingReport.Beer_total_value = totalBeerprice;
          existingReport.IMFS_total_bottle = totalIMFsbottle;
          existingReport.IMFS_total_value = totalIMFsprice;
          existingReport.Total_Case = totalBeerQuantity + totalIFSCQuantity;
          existingReport.Total_Bottle = totalBeerbottle + totalIMFsbottle;
          existingReport.Total_amount = totalBeerprice + totalIMFsprice;
          existingReport.Invoice = data.invoice;
          await existingReport.save();
        } else {
          const newData = new InvoiceNum({
            Beer_size: itemTypeWiseTotal.Beer_sale,
            IMFS_sie: itemTypeWiseTotal.IMFS_sale,
            Beer_Case: totalBeerQuantity,
            IMFS_case: totalIFSCQuantity,
            Beer_total_bottle: totalBeerbottle,
            Beer_total_value: totalBeerprice,
            IMFS_total_bottle: totalIMFsbottle,
            IMFS_total_value: totalIMFsprice,
            Total_Case: totalBeerQuantity + totalIFSCQuantity,
            Total_Bottle: totalBeerbottle + totalIMFsbottle,
            Total_amount: totalBeerprice + totalIMFsprice,
            Invoice: data.invoice,
          });
          await newData.save();
        }
      }
      response.status(200).json({ message: "Report updated successfully" });
    } catch (error) {
      console.error("Error in saving invoice data:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },

  updateData: async (request, response) => {
    try {
      const Data = request.body;
      // console.log(Data.formDetails);
      const Getdata = await FormData.findById(Data.id);
      // console.log(Getdata);
      var cs = parseInt(Data.editedCaseValue) * parseInt(Getdata.Quantity);

      var closingBottle = cs + parseInt(Data.editedLooseValue);
      // console.log(closingBottle);
      var totalBottle = Getdata.Opening_bottle + Getdata.Receipt_bottle;
      // console.log(totalBottle);
      var salesBottle = parseInt(totalBottle) - parseInt(closingBottle);
      // console.log(salesBottle,"rtyui")
      var salesvalues = parseInt(salesBottle) * parseInt(Getdata.MRP_Value);
      var ClosingValue = parseInt(Getdata.Total_value) - parseInt(salesvalues);
      // var openingbottle = totalBottle - salesBottle;
      const searchId = await FormData.findByIdAndUpdate(Data.id, {
        Case: Data.editedCaseValue,
        Loose: Data.editedLooseValue,
        Total_bottle: totalBottle,
        Closing_bottle: closingBottle,
        Sale_value: salesvalues,
        Sales_bottle: salesBottle,
        Closing_value: ClosingValue,
        // Opening_bottle: openingbottle,
      });
      await searchId.save();
      response.json({ message: "case updated successfully" });
    } catch (error) {
      response.json({ message: "Error in updating case backend " });
      console.log("Error in updating case backend :", error);
    }
  },

  delete: async (request, response) => {
    for (const d of formDetails) {
      const existingData = await DailyData.findOne({
        Date: {
          $gte: new Date(dateString), // Greater than or equal to the start of the date
          $lt: new Date(dateString).setHours(23, 59, 59, 999), // Less than the end of the date
        },
        Item_Code: d.Item_Code,
      });
    }
  },
  dd: async (request, response) => {
    try {
      const formDetails = request.body;
      const userId = request.userId;
      const dateObject = new Date();

      // Extracting date components
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1;
      const day = dateObject.getDate();
      const dateString = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      for (const d of formDetails) {
        const existingData = await DailyData.findOne({
          Date: {
            $gte: new Date(dateString), // Greater than or equal to the start of the date
            $lt: new Date(dateString).setHours(23, 59, 59, 999), // Less than the end of the date
          },
          Item_Code: d.Item_Code,
        });

        if (!existingData) {
          //     // If no existing entry found, create a new one
          const newdata = new DailyData({
            Range: d.Range,
            Product: d.Product,
            Description: d.Description,
            Item_Code: d.Item_Code,
            Size: d.Size,
            MRP_Value: d.MRP_Value,
            Opening_bottle: d.Opening_bottle,
            Receipt_bottle: d.Receipt_bottle == null ? 0 : d.Receipt_bottle,
            Case: d.Case == null ? 0 : d.Case,
            Loose: d.Loose == null ? 0 : d.Loose,
            Item_type: d.Item_type,
            Quantity: d.Quantity,
            Opening_value: d.Opening_value,
            Receipt_value: d.Receipt_value == null ? 0 : d.Receipt_value,
            Total_value: d.Total_value == null ? 0 : d.Total_value,
            Total_bottle:
              d.Total_bottle == null
                ? d.Opening_bottle + d.Receipt_bottle
                : d.Total_bottle,
            Closing_bottle: d.Closing_bottle == null ? 0 : d.Closing_bottle,
            Sales_bottle: d.Sales_bottle == null ? 0 : d.Sales_bottle,
            Sale_value: d.Sale_value == null ? 0 : d.Sale_value,
            Closing_value: d.Closing_value == null ? 0 : d.Closing_value,
            updatedAt: Date.now(),
          });
          console.log("dfghyuiop");

          await newdata.save();
        }
      }

      formDetails.map(async (d) => {
        // const find = await FormData.findById(d._id);

        var totalValue =
          d.Closing_bottle == null
            ? d.MRP_Value * d.Total_bottle
            : d.MRP_Value * d.Closing_bottle;

        var newform = await FormData.findByIdAndUpdate(d._id, {
          Opening_bottle:
            d.Closing_bottle == null ? d.Total_bottle : d.Closing_bottle,
          Opening_value:
            d.Closing_bottle == null
              ? d.MRP_Value * d.Total_bottle
              : d.MRP_Value * d.Closing_bottle,
          Receipt_value: null,
          Total_value: totalValue,
          updatedAt: Date.now(),
          Total_bottle: null,
          Receipt_bottle: null,
          Closing_bottle: null,
          Sales_bottle: null,
          Sale_value: null,
          Closing_value: null,
          Case: null,
          Loose: null,
          Total_bottle:
            d.Closing_bottle == null ? d.Total_bottle : d.Closing_bottle,
        });
        await newform.save();
      });

      response.json({ message: "daily data  successfully" });
    } catch (error) {
      response.json({ message: "Error in daily data  backend " });
      console.log("Error in daily data  backend :", error);
    }
  },

  openingUpdate: async (request, response) => {
    try {
      const formDetails = request.body;
      for (let i = 0; i < formDetails.length; i++) {
        formDetails[i].Opening_bottle =
          parseInt(formDetails[i].Total_bottle) -
          parseInt(formDetails[i].Sales_bottle);
        console.log(formDetails[i].Opening_bottle);
      }
      console.log(formDetails);

      response.json({ message: "daily data  successfully" });
    } catch (error) {
      response.json({ message: "Error in opening data  backend " });
      console.log("Error in openings data  backend :", error);
    }
  },
  getdailyData: async (request, response) => {
    try {
      const data = await DailyData.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  getinvoice: async (request, response) => {
    try {
      const data = await InvoiceNum.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  getItemMaster: async (request, response) => {
    try {
      const data = await Inward.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  search: async (request, response) => {
    try {
      const { chk } = request.body;
      console.log(chk);
      const searchdate = await FormData.find({ date: chk }, {});
      response.send(searchdate);
    } catch (error) {
      response.json({ message: "Error in search case backend " });
      console.log("Error in search case backend :", error);
    }
  },

  SearchByDateDailydata: async (req, res) => {
    try {
      const { dateSearch } = req.body; // Assuming dateSearch contains fromDate and toDate
      console.log(dateSearch);
      // Search for daily data within the specified date range
      const existingData = await DailyData.find({
        Date: {
          $gte: new Date(dateSearch.fromDate), // Greater than or equal to the start of the date
          $lte: new Date(new Date(dateSearch.toDate).setHours(23, 59, 59, 999)), // Less than or equal to the end of the date
        },
      });
      console.log(existingData);
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
module.exports = Formcontroller;
