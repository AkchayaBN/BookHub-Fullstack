const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bookRoutes = require("./routes/bookRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", require("./routes/categoryRoutes"));
app.get("/", (req, res) => {
  res.send("BookHub API running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
