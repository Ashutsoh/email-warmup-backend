const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Routes
const smtpRoutes = require("./routes/smtpRoutes");
const warmupRoutes = require("./routes/warmupRoutes");

app.use("/api/smtp", smtpRoutes);
app.use("/api/warmup", warmupRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
