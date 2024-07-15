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
    await Formcontroller.dd({}, {});

    console.log("Scheduled task executed successfully");
  } catch (error) {
    console.error("Error executing scheduled task:", error);
  }
};

// Function to check and run the scheduled task at the correct time
const checkAndRunScheduledTask = () => {
  const currentTime = moment.tz("Asia/Kolkata");
  if (currentTime.hours() === 23 && currentTime.minutes() === 59) {
    console.log(
      `Scheduled task triggered at ${currentTime.format()} in Asia/Kolkata timezone`
    );
    runScheduledTask();
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

    // Schedule the task to run every minute and check for the specific time
    cron.schedule(
      "* * * * *",
      () => {
        console.log("Cron job triggered, checking the time...");
        setTimeout(checkAndRunScheduledTask, 0); // Check and run immediately
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );

    console.log(
      "Scheduled task will run daily at 11:59 PM in Asia/Kolkata timezone"
    );
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
