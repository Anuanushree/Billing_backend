const User = require("../model/user");
const bcrypt = require("bcrypt");
const config = require("../utilis/config");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Inward = require("../model/Invade");
const FormData = require("../model/FormData");
const Secret = config.SECRET_CODE;

const usercontroller = {
  signup: async (request, response) => {
    try {
      const { username, email, password } = request.body;
      const chkuser = await User.findOne({ email });
      if (chkuser) {
        return response.json({ error: "mail id already exists" });
      }
      const hashedpassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashedpassword,
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
      const user = await User.findOne({ email });
      const udt = await User.findByIdAndUpdate(user._id, { Able: "true" });
      await udt.save();

      if (!user) {
        return response.json({ error: "email doesn't exists" });
      }
      const chkpassword = await bcrypt.compare(password, user.password);
      if (!chkpassword) {
        return response.json({ error: "invalid password" });
      }
      const payload = {
        username: user.username,
        userId: user._id,
        mail: user.email,
      };
      const token = jwt.sign(payload, Secret);

      response.send({ token: token, id: user._id, username: user.username });
    } catch (error) {
      response.json({ message: "Error in signin" });
      console.log("Error in signin ", error);
    }
  },
  list: async (request, response) => {
    try {
      const user = await User.find({}, {});
      response.send(user);
    } catch (error) {
      response.json({ message: "Error in getting list " });
      console.log("Error in getting list :", error);
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
      const { password, id } = request.body;

      const user = await User.findById(id);
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
