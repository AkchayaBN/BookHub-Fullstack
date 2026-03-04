const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const verifyToken = require("../middleware/authMiddleware");

// ===============================
// GET My Rentals
// ===============================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection("rentals")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const rentals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// CHECK ACTIVE RENTAL FOR BOOK
// ===============================
router.get("/check/:bookId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { bookId } = req.params;

    const snapshot = await db
      .collection("rentals")
      .where("userId", "==", userId)
      .where("bookId", "==", bookId)
      .where("status", "==", "active")
      .get();

    if (snapshot.empty) {
      return res.json(null);
    }

    const rental = snapshot.docs[0];
    res.json({ id: rental.id, ...rental.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===============================
// RENT BOOK
// ===============================
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { bookId, durationInDays, price, planName } = req.body;

    const startsAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(startsAt.getDate() + durationInDays);

    const newRental = {
      userId,
      bookId,
      planName,
      durationInDays,
      price,
      startsAt,
      expiresAt,
      status: "active",
      createdAt: new Date(),
    };

    const docRef = await db.collection("rentals").add(newRental);

    res.status(201).json({ id: docRef.id, ...newRental });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
