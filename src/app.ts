import { join, resolve } from "node:path";

import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import httpErrors from "http-errors";
import morgan from "morgan";
import { container } from "tsyringe";
import TasksController from "./tasks/tasks.controller";

export default () => {
  const app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(resolve(__dirname, "..", "public")));

  // view engine setup
  app.set("views", join(__dirname));
  app.set("view engine", "ejs");

  const tasksController = container.resolve(TasksController);
  tasksController.attachRouter(app);

  app.get("/", function (req, res) {
    res.redirect("/tasks");
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(httpErrors(404));
  });

  // error handler
  app.use(
    (
      err: Error & { status?: number },
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("errors/views/index");
    }
  );

  return app;
};
