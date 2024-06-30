const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const Formcontroller = require("./controllers/FormDataControllers");

// Connect to MongoDB with extended timeout
mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start HTTP server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    // Define the time to run the task at the end of the day
    const scheduleTime = new Date();
    scheduleTime.setHours(23, 59, 0, 0);

    // Calculate the delay until the scheduled time
    const now = new Date();
    let delay = scheduleTime.getTime() - now.getTime();

    // If the scheduled time is in the past, set it for the next day
    if (delay < 0) {
      delay += 24 * 60 * 60 * 1000; // Add 24 hours (in milliseconds)
    }

    // Output the scheduled task information
    console.log(`Scheduled task will run at ${scheduleTime.toISOString()}`);

    // Execute the task after the calculated delay
    setTimeout(async function runTask() {
      try {
        console.log("Running scheduled task...");

        // Execute the data processing task
        await Formcontroller.dd({}, {});

        console.log("Scheduled task executed successfully");
      } catch (error) {
        console.error("Error executing scheduled task:", error);
      }

      // Schedule the next run for the next day at the same time
      setTimeout(runTask, 24 * 60 * 60 * 1000); // Run again after 24 hours
    }, delay);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
