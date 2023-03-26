const admin = require("firebase-admin");
const serviceAccount = require("../../firebase-key.json");

module.exports = () => {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  return admin.firestore();
};
