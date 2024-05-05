const User = require("../model/user");
const FormData = require("../model/FormData");
const { request } = require("express");
const DailyReport = require("../model/dailyReport");
const Inward = require("../model/Invade");
const DailyData = require("../model/dailydata");
const Sale = require("../model/sale");
const { parse } = require("dotenv");

const Formcontroller = {
  Create: async (request, response) => {
    try {
      const formData = request.body;
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
        Description: data.desciption,
        Receipt_bottle: parseInt(data.ReceiptBottle),
        Opening_bottle: parseInt(data.OpeningBottle),
        Case: null,
        Loose: null,
        Receipt_value: parseInt(data.editMRP) * parseInt(data.ReceiptBottle),
        Opening_value: parseInt(data.editMRP) * parseInt(data.OpeningBottle),
        Total_value: totalValue,
        updatedAt: Date.now(),
        invoice: data.invoice,
      });
      await searchId.save();
      const chkinvoice = await User.findOne({ invoice });
      if (!chkinvoice) {
      }
      // const findFormId = await FormData.findByIdAndUpdate(formUpdate._id, {
      //   Description: data.desciption,
      //   Receipt_bottle: parseInt(data.ReceiptBottle),
      //   Opening_bottle: parseInt(data.OpeningBottle),
      //   Case: null,
      //   Loose: null,
      //   Receipt_value: parseInt(data.editMRP) * parseInt(data.ReceiptBottle),
      //   Opening_value: parseInt(data.editMRP) * parseInt(data.OpeningBottle),
      //   Total_value: totalValue,
      //   updatedAt: Date.now(),
      // });
      // await findFormId.save();
      response.json({ message: "case updated successfully" });
    } catch (error) {
      response.json({ message: "Error in updating case backend " });
      console.log("Error in updating case backend :", error);
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
      var totalBottle =
        parseInt(Getdata.Opening_bottle) + parseInt(Getdata.Receipt_bottle);
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
      const formDetails = request.body;
      const userId = request.userId;
      // const copydata = await FormData.findById(Data.id);

      formDetails.map(async (d) => {
        const newdata = new DailyData({
          Range: d.Range,
          Product: d.Product,
          Description: d.Description,
          Item_Code: d.Item_Code,
          Size: d.Size,
          MRP_Value: d.MRP_Value,
          Opening_bottle: d.Opening_bottle,
          Receipt_bottle: d.Receipt_bottle,
          Case: d.Case,
          Loose: d.Loose,
          Item_type: d.Item_type,
          Quantity: d.Quantity,
          Opening_value: d.Opening_value,
          Receipt_value: d.Receipt_value,
          Total_value: d.Total_value,
          Total_bottle: d.Total_bottle,
          Closing_bottle: d.Closing_bottle,
          Sales_bottle: d.Sales_bottle,
          Sale_value: d.Sale_value,
          Closing_value: d.Closing_value,
          updatedAt: Date.now(),
        });
        await newdata.save();
      });

      formDetails.map(async (d) => {
        const find = await FormData.findById(d._id);
        if (find.Sales_bottle) {
          var totalValue =
            find.MRP_Value * find.Opening_bottle +
            find.MRP_Value * find.Receipt_bottle;
          var openingbottle = find.Total_bottle - parseInt(find.Sales_bottle);
          console.log(openingbottle);
          var newform = await FormData.findByIdAndUpdate(d._id, {
            Opening_bottle: openingbottle,
            Opening_value: find.MRP_Value * find.Opening_bottle,
            Receipt_value: find.MRP_Value * find.Receipt_bottle,
            Total_value: totalValue,
            updatedAt: Date.now(),
            Total_bottle: null,
            Closing_bottle: null,
            Sales_bottle: null,
            Sale_value: null,
            Closing_value: null,
            Case: null,
            Loose: null,
          });
          await newform.save();
        } else {
          var newform = await FormData.findByIdAndUpdate(d._id, {
            Opening_bottle: find.Opening_bottle,
            Opening_value: find.MRP_Value * find.Opening_bottle,
            Receipt_value: find.MRP_Value * find.Receipt_bottle,
            Total_value: find.Total_value,
            updatedAt: Date.now(),
            Total_bottle: null,
            Closing_bottle: null,
            Sales_bottle: null,
            Sale_value: null,
            Closing_value: null,
            Case: null,
            Loose: null,
          });
        }
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

      // formDetails.map((d) => {
      //   const newForm = new FormData({
      //     Range: d.Range,
      //     Product: d.Product,
      //     Description: d.Description,
      //     Item_Code: d.Item_Code,
      //     Size: d.Size,
      //     MRP_Value: d.MRP_Value,
      //     Opening_bottle: d.Opening_bottle,
      //     Receipt_bottle: d.Receipt_bottle,
      //     Case: d.Case,
      //     Loose: d.Loose,
      //     Item_type: d.Item_type,
      //     Quantity: d.Quantity,
      //     Opening_value: d.Opening_value,
      //     // Receipt_value: d.Receipt_value,
      //     // Total_value: d.Total_value,
      //     // Total_bottle: d.Total_bottle,
      //     // Closing_bottle: d.Closing_bottle,
      //     // Sales_bottle: d.Sales_bottle,
      //     // Sale_value: d.Sale_value,
      //     // Closing_value: d.Closing_value,
      //     updatedAt: Date.now(),
      //   });
      //   newForm.save();
      // });
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
};
module.exports = Formcontroller;
