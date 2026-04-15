const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "Build good habits and break bad ones.",
    price: 499,
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80",
    category: "Self-Help",
    isFeatured: true,
    isBestseller: true,
    createdAt: new Date(),
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    description: "Rules for focused success in a distracted world.",
    price: 450,
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80",
    category: "Mystery",
    isFeatured: false,
    isBestseller: true,
    createdAt: new Date(),
  },
  {
  title: "Rich Dad Poor Dad",
  author: "Robert Kiyosaki",
  description: "What the rich teach their kids about money.",
  price: 399,
  coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&q=80",
  category: "Self-Help", // ✅ was "fiction" — wrong category entirely
  isFeatured: true,
  isBestseller: true,
  createdAt: new Date(),
}
];

async function seed() {
  try {
    for (const book of books) {
      console.log("Adding:", book.title);
      await db.collection("books").add(book);
    }
    console.log("Books added successfully!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

seed();