const mongoose = require("mongoose"); // Uncommented mongoose import
const config = require("./utilis/config");
const app = require("./App");
const Formcontroller = require("./controllers/FormDataControllers");

// Function to run the scheduled task
const runScheduledTask = async () => {
  try {
    console.log("Running scheduled task...");

    // Execute the data processing task
    // await Formcontroller.dd({}, {}); // Ensure this function exists and is implemented correctly

    console.log("Scheduled task executed successfully");
  } catch (error) {
    console.error("Error executing scheduled task:", error);
  }
};

// Connect to MongoDB
mongoose
  .connect(config.MONGO_URL, {}) // Use updated connection options
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start HTTP server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    // Function to calculate milliseconds until 11:45 PM today
    const calculateDelayUntilEndOfDay = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(20, 52, 0, 0); // Combined setting hours, minutes, seconds, and milliseconds

      let delay = endOfDay - now;
      if (delay < 0) {
        // If it's already past 11:45 PM today, calculate delay for tomorrow
        endOfDay.setDate(endOfDay.getDate() + 1);
        delay = endOfDay - now;
      }
      return delay;
    };

    // Schedule the task using setTimeout
    const scheduleTask = () => {
      const delay = calculateDelayUntilEndOfDay();
      setTimeout(() => {
        runScheduledTask().then(() => {
          scheduleTask(); // Schedule the next execution after the current task is completed
        });
      }, delay);
    };

    // Start scheduling the task
    scheduleTask();

    console.log("Scheduled task will run daily at 11:45 PM");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
