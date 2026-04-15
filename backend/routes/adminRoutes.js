const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const verifyToken = require("../middleware/authMiddleware");

// ============================
// ADMIN GUARD MIDDLEWARE
// ============================
const verifyAdmin = (req, res, next) => {
  const email = req.user?.email || "";
  if (!email.endsWith("@student.tce.edu")) {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

// ============================
// STATS
// ============================
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [booksSnap, ordersSnap, rentalsSnap] = await Promise.all([
      db.collection("books").get(),
      db.collection("orders").get(),
      db.collection("rentals").get(),
    ]);

    const totalRevenue = ordersSnap.docs.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.totalAmount || 0);
    }, 0);

    const activeRentals = rentalsSnap.docs.filter(
      (doc) => doc.data().status === "active"
    ).length;

    const pendingOrders = ordersSnap.docs.filter(
      (doc) => doc.data().status === "pending"
    ).length;

    res.json({
      totalBooks: booksSnap.size,
      totalOrders: ordersSnap.size,
      totalRentals: rentalsSnap.size,
      activeRentals,
      pendingOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================
// GET ALL ORDERS
// ============================
router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();

    const orders = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
        };
      })
      .sort((a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
      );

    res.json(orders);
  } catch (error) {
    console.error("Admin orders error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================
// UPDATE ORDER STATUS
// ============================
router.patch("/orders/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const docRef = db.collection("orders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    await docRef.update({ status, updatedAt: new Date() });
    res.json({ message: "Order status updated", id, status });
  } catch (error) {
    console.error("Update order error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================
// GET ALL RENTALS
// ============================
router.get("/rentals", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("rentals").get();

    const rentals = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate().toISOString()
            : data.createdAt || null,
          startsAt: data.startsAt?.toDate
            ? data.startsAt.toDate().toISOString()
            : data.startsAt || null,
          expiresAt: data.expiresAt?.toDate
            ? data.expiresAt.toDate().toISOString()
            : data.expiresAt || null,
        };
      })
      .sort((a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
      );

    res.json(rentals);
  } catch (error) {
    console.error("Admin rentals error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ============================
// DELETE BOOK
// ============================
router.delete("/books/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Book not found" });
    }

    await docRef.delete();
    res.json({ message: "Book deleted", id });
  } catch (error) {
    console.error("Delete book error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;