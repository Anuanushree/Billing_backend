const mongoose = require("mongoose");
const config = require("./utilis/config");
const app = require("./App");
const cron = require("node-cron");
const Formcontroller = require("./controllers/FormDataControllers");

// Connect to MongoDB with extended timeout
mongoose
  .connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Example: Increase timeout to 30 seconds
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start HTTP server
    app.listen(config.PORT, () => {
      console.log(`Server is running on port ${config.PORT}`);
    });

    // Define the cron job to run daily at 14:13 (2:13 PM)
    cron.schedule("45 14 * * *", async () => {
      try {
        console.log("Time's up! Running scheduled task...");

        // Execute the data processing task
        await Formcontroller.dd({}, {});

        console.log("Scheduled task executed successfully");
      } catch (error) {
        console.error("Error executing scheduled task:", error);
      }
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
