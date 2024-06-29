const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const cron = require("node-cron");
const Formcontroller = require("./controllers/FormDataControllers");

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

// Define the cron job to run at the end of the day
cron.schedule("59 23 * * *", async () => {
  try {
    console.log("times up");
    await Formcontroller.dd({}, {}); // Make sure to pass req, res if needed
    console.log("Scheduled task executed successfully");
  } catch (error) {
    console.error("Error executing scheduled task:", error);
  }
});
