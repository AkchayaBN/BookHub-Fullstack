const admin = require("firebase-admin");

const getCredential = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  return require("./serviceAccountKey.json");
};

admin.initializeApp({
  credential: admin.credential.cert(getCredential()),
});

const db = admin.firestore();

module.exports = db;
