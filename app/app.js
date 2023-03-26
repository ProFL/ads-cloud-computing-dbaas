const path = require("path");

const cookieParser = require("cookie-parser");
const express = require("express");
const httpErrors = require("http-errors");
const morgan = require("morgan");

const config = require("./config");
const tasks = require("./tasks");

module.exports = () => {
  let app = express();

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.resolve(__dirname, "..", "public")));

  // view engine setup
  app.set("views", path.join(__dirname));
  app.set("view engine", "ejs");

  app = config(app);

  app = tasks(app);

  app.get("/", function (req, res) {
    res.redirect("/tasks");
  });

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(httpErrors(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("errors/views/index");
  });

  return app;
};
