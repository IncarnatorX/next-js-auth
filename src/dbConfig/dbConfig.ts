import mongoose from "mongoose";

const mongoURI: string = process.env.MONGO_URI!;

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Successfully connected to MongoDB");
    });
    connection.on("error", (error) => {
      console.log("Error connecting to Database");
      console.error("Error: ", error.message);
      process.exit();
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Something wen't wrong");
      console.error("Error Name:", error.name);
      console.error("Error Message: ", error.message);
    }
  }
}

export default connectDB;
