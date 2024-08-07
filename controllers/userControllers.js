const User = require("../model/user");
const bcrypt = require("bcrypt");
const config = require("../utilis/config");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Inward = require("../model/Invade");
const FormData = require("../model/FormData");
const DailyData = require("../model/dailydata");
const DailyReport = require("../model/dailyReport");
const InvoiceNum = require("../model/invoiceNum");
const Sale = require("../model/sale");

const Secret = config.SECRET_CODE;

const usercontroller = {
  signup: async (request, response) => {
    try {
      const { username, email, password, storeName } = request.body;
      const chkuser = await User.findOne({ email });
      if (chkuser) {
        return response.json({ error: "mail id already exists" });
      }
      const hashedpassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedpassword,
        storeName,
      });
      await newUser.save();

      const sharedData = await Inward.find({});
      console.log(sharedData);
      for (const d of sharedData) {
        const newData = new FormData({
          Range: d.Range,
          Product: d.Product,
          Description: d.Description,
          Item_Code: d.Item_Code,
          Case_Quantity: d.Case_Quantity,
          MRP_Value: d.MRP_Value,
          Size: d.Size,
          Item_type: d.Item_type,
          Receipt_bottle: d.Receipt_bottle,
          Opening_bottle: d.Opening_bottle,
          Quantity: d.Quantity,
          Opening_value: d.Opening_value,
          Receipt_value: d.Receipt_value,
          Total_value: d.Total_value,
          Total_bottle: d.Total_bottle,
          user: newUser._id,
        });

        await newData.save();
      }
      response.status(200).json({ message: "User added successfully" });
    } catch (error) {
      console.log("Error in signup", error);
      response.json({ message: "Error in sigup" });
    }
  },
  signin: async (request, response) => {
    try {
      const { email, password } = request.body;
      console.log("Sign-in request received for:", email);

      const user = await User.findOne({ email });
      if (!user) {
        return response.status(404).json({ error: "Email doesn't exist" });
      }

      const chkpassword = await bcrypt.compare(password, user.password);
      if (!chkpassword) {
        return response.status(401).json({ error: "Invalid password" });
      }

      const payload = {
        username: user.username,
        userId: user._id,
        mail: user.email,
      };
      const token = jwt.sign(payload, Secret, { expiresIn: "1h" });

      response.status(200).send({
        token: token,
        id: user._id,
        username: user.username,
        Admin: user.Admin,
      });
    } catch (error) {
      console.error("Error in signin:", error);
      response.status(500).json({ message: "Error in signin" });
    }
  },

  list: async (request, response) => {
    try {
      const users = await User.find({}, {});
      response.send(users);
    } catch (error) {
      response
        .status(500)
        .json({ message: "Error in getting user list", error: error.message });
    }
  },
  forgot: async (request, response) => {
    try {
      const { email } = request.body;
      const user = await User.findOne({ email });
      if (!user) {
        return response.json({ error: "Invalid mail id" });
      }
      const link = `http://localhost:3000/resetPassword/${user.id}`;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.EMAIL,
          pass: config.PASSWORD,
        },
      });
      async function sendmail() {
        const info = await transporter.sendMail({
          from: `"Anushree" <${config.EMAIL}>`,
          to: user.email,
          subject: "Reset Password",
          text: link,
        });
        console.log("message send:%s", info.messageId);
      }
      sendmail().catch(console.error);
      response.json({ error: "mail sended successfully" });
    } catch (error) {
      response.json({ message: "Error in forgot page" });
      console.log("Error in forgot page :", error);
    }
  },
  reset: async (request, response) => {
    try {
      const { password, userId } = request.body;

      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        return response.json({ error: "Error in reset, pls try again" });
      }

      const hashedpassword = await bcrypt.hash(password, 10);
      user.password = hashedpassword;
      await user.save();
      response.json({ message: "password updated successfully" });
    } catch (error) {
      response.json({ error: "Error in reset password" });
      console.log("Error in reset password");
    }
  },
  deleteUser: async (request, response) => {
    try {
      const userId = request.params.userId; // Extract userId from route parameters

      const user = await User.findByIdAndDelete(userId); // Find and delete user

      if (!user) {
        return response.status(404).json({ error: "User not found" });
      }
      await FormData.deleteMany({ user: userId }); // Example: Delete FormData related to this user
      await DailyReport.deleteMany({ user: userId });
      await DailyData.deleteMany({ user: userId }); // Example: Delete FormData related to this user
      await InvoiceNum.deleteMany({ user: userId });
      // Example: Delete FormData related to this user
      await Sale.deleteMany({ user: userId });
      response.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      response.status(500).json({ error: "Error deleting user" });
    }
  },
  updateUser: async (request, response) => {
    try {
      const userId = request.userId;
      const {
        username,
        profilename,
        userLname,
        email,
        phone,
        address,
        gender,
        profession,
      } = request.body;
      const user = await User.findByIdAndUpdate(userId, {
        username,
        profilename,
        email,
        phone,
        gender,
        profession,
        address,
        userLname,
        updatedAt: Date.now(),
      });
      await user.save();
      response.json({ message: "Profile updated successfully" });
    } catch (error) {
      console.log("Error in updateuser:", error);
      response.json({ error: "error in updateing user" });
    }
  },
  getprofile: async (request, response) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId);
      response.json(user);
    } catch (error) {
      console.log("Error in getting user:", error);
      response.json({ message: "error in display user" });
    }
  },
};
module.exports = usercontroller;
