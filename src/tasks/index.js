const configTokens = require("../config/tokens");

const tokens = require("./tokens");
const tasksController = require("./tasks.controller");
const tasksRepository = require("./tasks.repository");

module.exports = (app) => {
  const firestore = app.get(configTokens.FIRESTORE_TOKEN);

  const repository = tasksRepository(firestore);
  app.set(tokens.TASKS_REPOSITORY_TOKEN, repository);

  const controller = tasksController(repository);

  app.use("/tasks", controller);

  return app;
};
