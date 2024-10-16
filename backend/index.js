const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const { User, Room, Booking, Payment } = require("./Models/Relations");
const { initializeDatabase } = require("./Models/db");
const uploadAvatar = require("./Utils/multer");
const createDatabase = require("./Models/createDatabase");
require("./Models/Relations");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "config/.env",
  });
}
console.log("JWT_SECRET", process.env.JWT_SECRET_KEY);
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
const PORT = process.env.PORT;
async function startApp() {
  // // Sebelum program di run Uncomment function createDatabase untuk membuat database
  // await createDatabase();
  await initializeDatabase();

  // Routes

  // Upload Avatar
  app.post(
    "/upload-avatar",
    uploadAvatar.single("avatar"),
    async (req, res, next) => {
      try {
        res.json(req.file.path);
      } catch (error) {
        next(error);
      }
    }
  );

  // Auth Routes
  app.use("/api/auth", require("./Routes/Auth"));

  // User Routes
  app.use("/api/user", require("./Routes/User"));

  // Room Routes
  app.use("/api/room", require("./Routes/Room"));

  // Booking Routes
  app.use("/api/booking", require("./Routes/Booking"));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startApp();
