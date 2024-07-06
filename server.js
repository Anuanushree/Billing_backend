const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const Formcontroller = require("./controllers/FormDataControllers");

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

    // Calculate milliseconds until 11:59 PM today
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23);
    endOfDay.setMinutes(31);
    endOfDay.setSeconds(0);
    endOfDay.setMilliseconds(0);
    let delay = endOfDay.getTime() - now.getTime();

    if (delay < 0) {
      // If it's already past 11:59 PM today, calculate delay for tomorrow
      endOfDay.setDate(endOfDay.getDate() + 1);
      delay = endOfDay.getTime() - now.getTime();
    }

    // Schedule the task using setTimeout
    setTimeout(runScheduledTask, delay);

    console.log(`Scheduled task will run at ${endOfDay.toLocaleString()}`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
