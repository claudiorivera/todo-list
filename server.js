const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const webhook = require("express-github-webhook");
require("dotenv").config();
const { exec } = require("child_process");
const pgp = require("pg-promise")();

// Environmental variables
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const cn = {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 30, // use up to 30 connections
};

const app = express();
const webHookHandler = webhook({ path: "/webhook", secret: SECRET_TOKEN });
// Postgres connection
const db = pgp(cn);

// Instantiate middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(webHookHandler);

// WebHooks
webHookHandler.on("*", function (event, repo, data) {
  console.log("webHookHandler event: ", event);
  exec("git pull", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});

app.get("/tasks", (req, res) => {
  res.sendStatus(200);
});

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`Server started listening on port ${SERVER_PORT}`);
});
