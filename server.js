const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./app");

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    console.log("connected to Mongodb successfully");
    app.listen(config.PORT, () => {
      console.log("server connecting port", config.PORT);
    });
  })
  .catch((error) => {
    console.error("Error in connecting mongodb ", error);
  });
