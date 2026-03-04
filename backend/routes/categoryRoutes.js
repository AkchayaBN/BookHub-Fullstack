const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("categories").get();

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;