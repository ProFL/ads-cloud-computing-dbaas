const express = require("express");
const joi = require("joi");

const router = express.Router();

module.exports = (tasksRepository) => {
  const createTaskSchema = joi.object({
    title: joi.string().min(3).required(),
  });

  const updateTaskSchema = joi.object({
    done: joi.boolean().required(),
  });

  router.post("/", function (req, res, next) {
    const validated = createTaskSchema.validate(req.body, { abortEarly: false });
    if (validated.error) {
      next(validated.error);
      return;
    }

    const { title } = validated.value;

    tasksRepository
      .createTask({ title })
      .then((task) => {
        console.log("Created task", { task });
        res.redirect("/tasks");
      })
      .catch(next);
  });

  router.get("/", function (req, res, next) {
    tasksRepository
      .getTasks()
      .then((tasks) => {
        res.render("tasks/views/index", { tasks });
      })
      .catch(next);
  });

  router.put("/:taskId", function (req, res, next) {
    const { taskId } = req.params;

    const validated = updateTaskSchema.validate(req.body, { abortEarly: false });
    if (validated.error) {
      next(validated.error);
      return;
    }

    const { done } = validated.value;

    tasksRepository
      .setTaskDone(taskId, done)
      .then((task) => {
        console.log("Updated task", { task });
        res.json(task);
      })
      .catch(next);
  });

  router.delete("/:taskId", function (req, res, next) {
    const { taskId } = req.params;

    tasksRepository
      .deleteTask(taskId)
      .then(() => {
        console.log("Deleted task", { taskId });
        res.status(204).end();
      })
      .catch(next);
  });

  return router;
};
