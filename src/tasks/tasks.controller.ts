import { validate } from "class-validator";
import express, { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import { CreateTaskDto } from "./dtos/createTask.dto";
import { SetTaskDoneDto } from "./dtos/setTaskDone.dto";
import TasksRepository from "./tasks.repository";

@singleton()
export default class TasksController {
  constructor(private readonly tasksRepository: TasksRepository) {}

  attachRouter(app: express.Express) {
    const router = express.Router();

    router.post("/", this.createTask.bind(this));
    router.get("/", this.listTasks.bind(this));
    router.put("/:taskId", this.setTaskDone.bind(this));
    router.delete("/:taskId", this.deleteTask.bind(this));

    app.use("/tasks", router);
  }

  createTask(req: Request, res: Response, next: NextFunction): void {
    const data = new CreateTaskDto(req.body);

    validate(data, { whitelist: true })
      .then((validated) => {
        if (validated.length > 0) {
          next(validated);
          return;
        }

        return this.tasksRepository
          .createTask(data)
          .then((task) => {
            console.log("Created task", { task });
            res.status(201).json(task);
          })
          .catch(next);
      })
      .catch(next);
  }

  listTasks(_: Request, res: Response, next: NextFunction): void {
    this.tasksRepository
      .getTasks()
      .then((tasks) => {
        res.render("tasks/views/index", { tasks });
      })
      .catch(next);
  }

  setTaskDone(req: Request, res: Response, next: NextFunction): void {
    const { taskId } = req.params;
    const data = new SetTaskDoneDto(req.body);

    validate(data)
      .then((validated) => {
        if (validated.length > 0) {
          throw validated;
        }

        this.tasksRepository
          .setTaskDone(taskId, data)
          .then((task) => {
            console.log("Updated task", { task });
            res.json(task);
          })
          .catch(next);
      })
      .catch(next);
  }

  deleteTask(req: Request, res: Response, next: NextFunction): void {
    const { taskId } = req.params;

    this.tasksRepository
      .deleteTask(taskId)
      .then(() => {
        console.log("Deleted task", { taskId });
        res.status(204).end();
      })
      .catch(next);
  }
}
