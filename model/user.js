const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  userLname: {
    type: String,
  },
  address: String,
  phone: Number,
  gender: String,
  profession: String,
  data: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FormData",
    },
  ],
  profilename: {
    type: String,
  },
  Able: Boolean,
});
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const User = mongoose.model("User", userSchema, "user");
module.exports = User;
