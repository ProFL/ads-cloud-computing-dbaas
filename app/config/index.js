const tokens = require("./tokens");
const initializeFirestore = require("./firestore");

module.exports = (app) => {
  app.set(tokens.FIRESTORE_TOKEN, initializeFirestore());
  return app;
};
