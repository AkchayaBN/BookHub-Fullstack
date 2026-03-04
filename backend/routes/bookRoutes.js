const express = require("express");
const router = express.Router();
const db = require("../config/firebase");


// ============================
// CREATE (POST)
// ============================
router.post("/", async (req, res) => {
  try {
    const { title, author, description, price, coverImage } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and Author are required" });
    }

    const newBook = {
      title,
      author,
      description: description || "",
      price: price || 0,
      coverImage: coverImage || "",
      createdAt: new Date(),
    };

    const docRef = await db.collection("books").add(newBook);

    res.status(201).json({ id: docRef.id, ...newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ============================
// READ ALL (GET)
// ============================
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("books").get();

    const books = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================
// READ ONE (GET by ID)
// ============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection("books").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ============================
// FULL UPDATE (PUT)
// ============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, description, price, coverImage } = req.body;

    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Book not found" });
    }

    const updatedBook = {
      title,
      author,
      description,
      price,
      coverImage,
      updatedAt: new Date(),
    };

    await docRef.set(updatedBook);

    res.json({ message: "Book fully updated", id, ...updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ============================
// PARTIAL UPDATE (PATCH)
// ============================
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Book not found" });
    }

    updates.updatedAt = new Date();

    await docRef.update(updates);

    res.json({ message: "Book partially updated", id, ...updates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ============================
// DELETE
// ============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection("books").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Book not found" });
    }

    await docRef.delete();

    res.json({ message: "Book deleted successfully", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
