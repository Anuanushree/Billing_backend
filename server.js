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
    const runScheduledTask = async () => {
      try {
        console.log("Running scheduled task...");

        // Execute the data processing task
        await Formcontroller.dd({}, {});

        console.log("Scheduled task executed successfully");
      } catch (error) {
        console.error("Error executing scheduled task:", error);
      }

      // Schedule the next run for the next day at the same time
      setTimeout(runScheduledTask, 24 * 60 * 60 * 1000); // Run again after 24 hours
    };
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
