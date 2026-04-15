const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Maps any variation → correct canonical category
const categoryFixes = {
  'fiction': 'Fiction',
  'non-fiction': 'Non-Fiction',
  'nonfiction': 'Non-Fiction',
  'science': 'Science',
  'history': 'History',
  'romance': 'Romance',
  'mystery': 'Mystery',
  'fantasy': 'Fantasy',
  'biography': 'Biography',
  'self-help': 'Self-Help',
  'selfhelp': 'Self-Help',
  'children': 'Children',
  'productivity': 'Self-Help', // ✅ remap Productivity → Self-Help
};

async function fixCategories() {
  const snapshot = await db.collection('books').get();

  let fixed = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const raw = data.category?.trim() ?? '';
    const canonical = categoryFixes[raw.toLowerCase()];

    if (canonical && canonical !== raw) {
      await doc.ref.update({ category: canonical });
      console.log(`✅ Fixed "${data.title}": "${raw}" → "${canonical}"`);
      fixed++;
    } else {
      console.log(`⏭️  Skipped "${data.title}": "${raw}" (already correct or unknown)`);
      skipped++;
    }
  }

  console.log(`\nDone! Fixed: ${fixed}, Skipped: ${skipped}`);
  process.exit();
}

fixCategories();