#!/usr/bin/env node

import "reflect-metadata";

import debug from "debug";
import { createServer } from "http";
import App from "./app";

const debugLogger = debug("ads-cloud-computing-dbaas:server");

const app = App();

const port = +(process.env.PORT || 3000);
app.set("port", port);

const server = createServer(app);
server.listen(port);

server.on("error", (error) => {
  // @ts-ignore
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // @ts-ignore
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debugLogger("Listening on " + bind);
});
