require("dotenv").config();

const app = require("./src/app");
const connect_DB = require("./src/db/db");

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
      throw new Error("Missing required env vars. Check backend/.env.example for required keys.");
    }

    await connect_DB();
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server running smoothly on port", process.env.PORT || 3000);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
