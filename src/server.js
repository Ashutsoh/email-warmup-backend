const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ------------------------------
// CORS (100% Render + Netlify compatible)
// ------------------------------
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ------------------------------
app.use(express.json());

// ------------------------------
// Load Routes
// ------------------------------
const smtpRoutes = require("./routes/smtpRoutes");
const warmupRoutes = require("./routes/warmupRoutes");

app.use("/api/smtp", smtpRoutes);
app.use("/api/warmup", warmupRoutes);

// ------------------------------
// Health Check Route (optional but useful)
// ------------------------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ------------------------------
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("⚡ Backend running on port:", PORT);
});
