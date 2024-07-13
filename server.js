const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const Formcontroller = require("./controllers/FormDataControllers");
const cron = require("node-cron");

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

    // Schedule the task to run every minute (for testing purposes)
    cron.schedule("* * * * *", () => {
      console.log("Scheduled task triggered every minute");
      runScheduledTask();
    });

    console.log("Scheduled task will run every minute for testing");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
