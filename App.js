const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const userRouter = require("./Router/route");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());

app.use("/user", userRouter);

module.exports = app;
