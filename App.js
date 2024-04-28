const cors = require("cors");
const express = require("express");
const app = express();


const userRouter = require("./Router/route");

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);




module.exports = app;
