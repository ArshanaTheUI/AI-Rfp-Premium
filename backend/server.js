// ====== IMPORTS ======
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ====== ENV CHECK ======
const requiredEnv = ["MONGO_URI", "GEMINI_API_KEY"];

console.log("🔐 Using env vars:", {
  MONGO_URI: process.env.MONGO_URI?.startsWith("mongodb+srv")
    ? "atlas..."
    : "missing",
  // OPENAI_API_KEY: process.env.OPENAI_API_KEY ? "set" : "missing",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "set" : "missing",
});

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(
    "❌ Missing required environment variables:",
    missingEnv.join(", ")
  );
  process.exit(1);
}

// ====== ROUTES ======
const rfpRoutes = require("./src/routes/rfpRoutes");
const vendorRoutes = require("./src/routes/vendorRoutes");
const emailRoutes = require("./src/routes/emailRoutes");
const sendRfpRoutes = require("./src/routes/sendRfpRoutes");
const statsRoutes = require("./src/routes/statsRoutes");



// ====== APP ======
const app = express();

app.use(cors());
app.use(express.json());

// ====== ROUTES ======
app.use("/api/rfps", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/send-rfp", sendRfpRoutes);
app.use("/api/stats", statsRoutes);

// ====== HEALTH CHECK ======
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI RFP Backend Running 🚀",
  });
});

// ====== START ======
const PORT = process.env.PORT || 4000;
const primaryUri = process.env.MONGO_URI.trim();
const localUri = (process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/ai-rfp").trim();

const attemptUris = [{ uri: primaryUri, label: "primary" }];
if (localUri && localUri !== primaryUri) {
  attemptUris.push({ uri: localUri, label: "local fallback" });
}

const hidePassword = (uri) =>
  uri.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.*)/, "$1*****$3");

const connectWithUri = async (uri, label) => {
  const safeUri = hidePassword(uri);
  console.log(`URI (${label}):`, safeUri);
  console.log(`🔗 Connecting to MongoDB (${label})...`);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`📦 MongoDB Connected Successfully (${label})`);
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

const tryConnect = async () => {
  for (const { uri, label } of attemptUris) {
    try {
      await connectWithUri(uri, label);
      startServer();
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection failed (${label}):`);
      console.error(err.message || err);
    }
  }

  console.error("❌ All MongoDB connection attempts failed.");
  console.error("Please ensure MongoDB is running locally or your Atlas URI is reachable.");
  console.error("Local Mongo check: Test-NetConnection -ComputerName 127.0.0.1 -Port 27017");
  process.exit(1);
};

tryConnect();