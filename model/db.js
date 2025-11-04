const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    const dbURI = "mongodb://localhost:27017/Bookingdetails";
    const options = {
      serverSelectionTimeoutMS: 100000,
      socketTimeoutMS: 120000,
    };
    await mongoose.connect(dbURI, options);

    // Listen to connection events
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });

    mongoose.connection.on("disconnected", async () => {
      console.log("Database disconnected, attempting to reconnect...");
      setTimeout(async () => {
        try {
          await mongoose.connect(dbURI, options);
          console.log("Reconnected to MongoDB successfully.");
        } catch (error) {
          console.error("Reconnection failed:", error);
        }
      }, 5000); // Retry after 5 seconds
    });

    // Graceful shutdown of database connection
    process.on("SIGINT", async () => {
      console.log("Process terminated, closing MongoDB connection...");
      await mongoose.connection.close();
      process.exit(0); // Exit cleanly
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process with failure code
  }
};

// Export the connection function
module.exports = connectToDatabase;
