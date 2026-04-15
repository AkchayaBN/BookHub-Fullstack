const express = require("express");
const router = express.Router();
const db = require("../config/firebase");
const verifyToken = require("../middleware/authMiddleware");

// ============================
// HELPER
// ============================
const serializeRental = (id, data) => ({
  id,
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
});

// ===============================
// GET MY RENTALS
// ===============================
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection("rentals")
      .where("userId", "==", userId)
      .get(); // ✅ removed .orderBy to avoid Firestore index requirement

    const rentals = snapshot.docs
      .map((doc) => serializeRental(doc.id, doc.data()))
      .sort((a, b) =>
        new Date(b.createdAt || "").getTime() -
        new Date(a.createdAt || "").getTime()
      ); // ✅ sort in JS instead

    res.json(rentals);
  } catch (error) {
    console.error("Rentals fetch error:", error.message);
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
    res.json(serializeRental(rental.id, rental.data()));
  } catch (error) {
    console.error("Check rental error:", error.message);
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

    if (!bookId || !durationInDays || !price || !planName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ check for existing active rental
    const existingSnapshot = await db
      .collection("rentals")
      .where("userId", "==", userId)
      .where("bookId", "==", bookId)
      .where("status", "==", "active")
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({
        error: "You already have an active rental for this book",
      });
    }

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
    res.status(201).json(serializeRental(docRef.id, newRental));
  } catch (error) {
    console.error("Rent book error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;