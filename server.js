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

// Postgres config
const dbConnectionConfig = {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  max: 30, // use up to 30 connections
};

const app = express();
const webHookHandler = webhook({ path: "/webhook", secret: SECRET_TOKEN });
const db = pgp(dbConnectionConfig);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(webHookHandler);

// WebHooks handler
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

// Routes
app.get("/tasks", async (req, res) => {
  try {
    const data = await db.any("SELECT * FROM tasks ORDER BY id ASC");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { task_description } = req.body;
    const data = await db.none(
      "INSERT INTO tasks(task_description, task_iscomplete) VALUES($1, $2)",
      [task_description, false]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
});

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task_iscomplete } = req.body;

  db.query("UPDATE tasks SET task_iscomplete = $1 WHERE id = $2", [
    task_iscomplete,
    id,
  ])
    .then(() => {
      res.status(200).send(`User modified with ID: ${id}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  db.query("DELETE FROM tasks WHERE id = $1", id)
    .then(() => {
      res.status(200).send(`User deleted with ID: ${id}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`Server started listening on port ${SERVER_PORT}`);
});
