const Formcontroller = require("./controllers/FormDataControllers");

(async () => {
  try {
    console.log("Cron job triggered at", new Date().toISOString());
    await Formcontroller.dd({}, {}); // Call your function
    console.log("Scheduled task executed successfully");
  } catch (error) {
    console.error("Error executing scheduled task:", error);
  }
})();
