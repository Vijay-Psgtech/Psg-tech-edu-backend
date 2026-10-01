require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const homepageRoutes = require("./routes/homepage");
const departmentRoutes = require("./routes/department");

const app = express();
const uploadsPath = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

connectDB();

const allowedOrigins = [process.env.CLIENT_ORIGIN, process.env.CMS_ORIGIN].filter(Boolean);
app.use(cors({ origin: allowedOrigins.length ? allowedOrigins : "*" }));
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);  
app.use("/api/homepage", homepageRoutes);
app.use("/api/departments", departmentRoutes);

// fallback error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    const maxUploadSizeMb = Number(process.env.MAX_UPLOAD_SIZE_MB) || 25;
    return res.status(413).json({
      message: `File is too large. Each file must be ${maxUploadSizeMb} MB or smaller.`,
    });
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "Invalid file upload", error: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Unexpected server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`PSG Tech backend running on port ${PORT}`));
