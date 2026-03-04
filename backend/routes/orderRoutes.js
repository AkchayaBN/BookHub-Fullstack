const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const verifyToken = require("../middleware/authMiddleware");

// Generate simple order number
const generateOrderNumber = () => {
  return "ORD-" + Math.floor(100000 + Math.random() * 900000);
};

// ===============================
// CREATE ORDER
// ===============================
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = {
      userId,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount,
      status: "pending",
      createdAt: new Date(),
    };

    const docRef = await db.collection("orders").add(newOrder);

    res.status(201).json({ id: docRef.id, ...newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// GET MY ORDERS
// ===============================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// CANCEL ORDER
// ===============================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const docRef = db.collection("orders").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (doc.data().userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (doc.data().status !== "pending") {
      return res.status(400).json({ error: "Cannot cancel this order" });
    }

    await docRef.update({ status: "cancelled" });

    res.json({ message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
