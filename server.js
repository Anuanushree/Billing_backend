const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const Formcontroller = require("./controllers/FormDataControllers");
const cron = require("node-cron");
const moment = require("moment-timezone");

// Function to run the scheduled task
const runScheduledTask = async () => {
  try {
    console.log("Running scheduled task...");

    // Execute the data processing task
    // await Formcontroller.dd({}, {});

    console.log("Scheduled task executed successfully");
  } catch (error) {
    console.error("Error executing scheduled task:", error);
  }
};

// Connect to MongoDB
mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start HTTP server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    // Log the current server time
    console.log("Current server time:", new Date().toString());

    // Schedule the task to run at 11:59 PM every day with a specific timezone
    cron.schedule(
      "* * * * *",
      () => {
        console.log(
          "Scheduled task triggered at 11:59 PM in Asia/Kolkata timezone"
        );
        runScheduledTask();
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata", // Set your desired timezone
      }
    );

    console.log(
      "Scheduled task will run daily at 11:59 PM in Asia/Kolkata timezone"
    );
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
