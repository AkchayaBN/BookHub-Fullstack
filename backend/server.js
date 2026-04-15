const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/bookRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ============================
// MIDDLEWARE
// ============================
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8080", // ✅ restrict to frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ============================
// ROUTES
// ============================
app.use("/api/books", bookRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
// ✅ removed categoryRoutes — file doesn't exist, was crashing server

// ============================
// HEALTH CHECK
// ============================
app.get("/", (req, res) => {
  res.json({ message: "BookHub API running..." }); // ✅ return JSON not plain text
});

// ============================
// 404 HANDLER
// ============================
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }); // ✅
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ BookHub server running on port ${PORT}`);
});