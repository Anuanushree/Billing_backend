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

    // Calculate milliseconds until 9:30 AM tomorrow
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(23);
    tomorrow.setMinutes(30);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    const delay = tomorrow.getTime() - now.getTime();

    // Schedule the task using setTimeout
    setTimeout(runScheduledTask, delay);

    console.log(`Scheduled task will run at ${tomorrow.toLocaleString()}`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
