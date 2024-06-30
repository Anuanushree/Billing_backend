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

      // Find all users
      const users = await User.find();

      // Loop through all users and create FormData for each
      const formDataArray = [];
      for (const user of users) {
        var Quantity = 0;

        // Calculate Quantity based on Size
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

        // Calculate totalValue based on MRP_Value and bottle counts
        const totalValue =
          formData.MRP_Value * formData.Opening_bottle +
          formData.MRP_Value * formData.Receipt_bottle;

        // Create new FormData instance with user reference
        const addData = new FormData({
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
          Total_bottle: formData.Opening_bottle + formData.Receipt_bottle,
          user: user.id, // Assign user reference here
        });

        // Save the new FormData instance
        await addData.save();
        // formDataArray.push(newdata); // Store the saved FormData in an array for response
      }

      response.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      console.error("Error saving form data:", error);
      response.status(500).json({ error: "Internal server error" });
    }
    // try {
    //   const { formData } = request.body;
    //   const userId = request.userId;
    //   const user = await User.findById(userId);
    //   var Quantity = 0;
    //   console.log(formData);
    //   if (formData.Size == 650 || formData.Size == 750) {
    //     Quantity = 12;
    //   } else if (
    //     formData.Size == 375 ||
    //     formData.Size == 500 ||
    //     formData.Size == 325
    //   ) {
    //     Quantity = 24;
    //   } else if (formData.Size == 180) {
    //     Quantity = 48;
    //   } else if (formData.Size == 1000) {
    //     Quantity = 9;
    //   }
    //   console.log(Quantity, "drtyui");
    //   var totalValue =
    //     formData.MRP_Value * formData.Opening_bottle +
    //     formData.MRP_Value * formData.Receipt_bottle;

    //   const addData = new FormData({
    //     // Date: formData.date,
    //     Range: formData.Range,
    //     Product: formData.Product,
    //     Description: formData.Description,
    //     Item_Code: formData.Item_Code,
    //     Case_Quantity: formData.Case_Quantity,
    //     MRP_Value: formData.MRP_Value,
    //     Size: formData.Size,
    //     Item_type: formData.Item_type,
    //     Receipt_bottle: formData.Receipt_bottle,
    //     Opening_bottle: formData.Opening_bottle,
    //     Quantity: Quantity,
    //     Opening_value: formData.MRP_Value * formData.Opening_bottle,
    //     Receipt_value: formData.MRP_Value * formData.Receipt_bottle,
    //     Total_value: totalValue,
    //     Total_bottle: formData.Opening_bottle + formData.Receipt_bottle,
    //     user: user._id,
    //   });
    //   console.log(addData);
    //   const newdata = await addData.save();
    //   // user.data = user.data.concat(newdata._id);

    //   // await user.save();

    //   response.status(200).json({ message: "data saved successfully" });
    // } catch (error) {
    //   console.log("error in save Form data :", error);
    //   response.send(error);
    // }
  },
  getAllData: async (request, response) => {
    try {
      const userId = request.userId;
      const data = await FormData.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  getAllDailyData: async (request, response) => {
    try {
      const userId = request.userId;
      const data = await DailyData.find({}, {});
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  getdata: async (request, response) => {
    try {
      const userId = request.userId;
      const data = await FormData.find({ user: userId });
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

  invoice: async (request, response) => {
    try {
      const data = request.body;
      const userId = request.userId;
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
            user: userId,
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
      console.log(Getdata);
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

  dd: async (request, response) => {
    try {
      const allUsers = await User.find({}, {}); // Assuming User is your Mongoose model for users

      for (const user of allUsers) {
        const userId = user._id;
        const data = await FormData.find({ user: userId });
        const formDetails = data.filter((f) => f.Total_bottle > 0);

        for (const d of formDetails) {
          const dateObject = new Date();
          dateObject.setDate(dateObject.getDate() - 1); // Set to yesterday
          dateObject.setHours(23, 59, 59, 999);
          const newdata = new DailyData({
            Date: dateObject,
            Range: d.Range,
            Product: d.Product,
            Description: d.Description,
            Item_Code: d.Item_Code,
            Size: d.Size,
            MRP_Value: d.MRP_Value,
            Opening_bottle: d.Opening_bottle,
            Receipt_bottle: d.Receipt_bottle || 0,
            Case: d.Case || 0,
            Loose: d.Loose || 0,
            Item_type: d.Item_type,
            Quantity: d.Quantity,
            Opening_value: d.Opening_value,
            Receipt_value: d.Receipt_value || 0,
            Total_value: d.Total_value || 0,
            Total_bottle: d.Total_bottle || d.Opening_bottle + d.Receipt_bottle,
            Closing_bottle: d.Closing_bottle || 0,
            Sales_bottle: d.Sales_bottle || 0,
            Sale_value: d.Sale_value || 0,
            Closing_value: d.Closing_value || 0,
            updatedAt: Date.now(),
            user: userId,
          });

          await newdata.save();
        }

        for (const d of formDetails) {
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
            Date: Date.now(),
            Total_bottle:
              d.Closing_bottle == null ? d.Total_bottle : d.Closing_bottle,
          });

          await newform.save();
        }
      }
      console.log("daily data updated successfully");
      // response.json({
      //   message: "Daily data processed successfully for all users.",
      // });
    } catch (error) {
      // response.json({ message: "Error processing daily data for users." });
      console.error("Error processing daily data for users:", error);
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
      const userId = request.userId;
      const data = await DailyData.find({ user: userId });
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  getinvoice: async (request, response) => {
    try {
      const userId = request.userId;
      const data = await InvoiceNum.find({ user: userId });
      response.send(data);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
    }
  },
  getItemMaster: async (request, response) => {
    try {
      const userId = request.userId;
      const data = await FormData.find({ user: userId });
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
      const userId = request.userId;
      const searchdate = await FormData.find({ date: chk, user: userId });
      response.send(searchdate);
    } catch (error) {
      response.json({ message: "Error in search case backend " });
      console.log("Error in search case backend :", error);
    }
  },

  SearchByDateDailydata: async (req, res) => {
    try {
      const { dateSearch } = req.body;
      const userId = request.userId;
      // Assuming dateSearch contains fromDate and toDate
      console.log(dateSearch);
      // Search for daily data within the specified date range
      const existingData = await DailyData.find({
        Date: {
          $gte: new Date(dateSearch.fromDate), // Greater than or equal to the start of the date
          $lte: new Date(new Date(dateSearch.toDate).setHours(23, 59, 59, 999)), // Less than or equal to the end of the date
        },
        user: userId,
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
  deleteDuplicates: async () => {
    try {
      // Step 1: Find all documents in the DailyData collection
      const allDailyData = await DailyData.find();

      // Step 2: Delete all found documents
      const deleteOperations = allDailyData.map(async (doc) => {
        await DailyData.findByIdAndDelete(doc._id);
      });

      // Execute all delete operations
      await Promise.all(deleteOperations);

      console.log(
        `Deleted ${allDailyData.length} documents from DailyData collection`
      );
    } catch (error) {
      console.error("Error deleting all DailyData:", error);
    }
    // try {
    //   // Step 1: Aggregate to identify duplicates
    //   const duplicates = await DailyData.aggregate([
    //     {
    //       $group: {
    //         _id: { user: "$user", Item_Code: "$Item_Code" },
    //         ids: { $push: "$_id" }, // Collect all _id values for duplicates
    //         count: { $sum: 1 }, // Count number of duplicates
    //       },
    //     },
    //     {
    //       $match: {
    //         count: { $gt: 1 }, // Match only groups with more than one document (duplicates)
    //       },
    //     },
    //   ]);

    //   // Step 2: Delete duplicates
    //   const deleteOperations = duplicates.map(async (duplicate) => {
    //     // Keep the document with the oldest _id (you can change the sort order as per your requirement)
    //     const toKeep = duplicate.ids.sort(
    //       (a, b) => a.getTimestamp() - b.getTimestamp()
    //     )[0];

    //     // Delete all documents except the one to keep
    //     const deleteIds = duplicate.ids.filter((id) => id !== toKeep);

    //     // Perform the delete operation
    //     await DailyData.deleteMany({ _id: { $in: deleteIds } });
    //   });

    //   // Execute all delete operations
    //   await Promise.all(deleteOperations);

    //   console.log("Duplicates deleted successfully.");
    // } catch (error) {
    //   console.error("Error deleting duplicates:", error);
    // }
  },
};
module.exports = Formcontroller;
