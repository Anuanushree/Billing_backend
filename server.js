const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const cron = require("node-cron");
const Formcontroller = require("./controllers/FormDataControllers");

// Connect to MongoDB with extended timeout and proper options
mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start HTTP server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    // Define the cron job to run daily at 21:05 (9:05 PM)
    cron.schedule("56 21 * * *", async () => {
      try {
        console.log("Time's up! Running scheduled task...");
        // Execute the data processing task
        // await Formcontroller.dd({}, {});
        console.log("Scheduled task executed successfully");
      } catch (error) {
        console.error("Error executing scheduled task:", error);
      }
    });

    console.log("Cron job scheduled to run daily at 21:05 (9:05 PM)");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
