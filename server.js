const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const webhook = require("express-github-webhook");
require("dotenv").config();
const { exec } = require("child_process");

// Postgres connection
const pgp = require("pg-promise");
// const db = pgp(`postgresql://claudio@localhost/todo-list`);

// Environmental variables
const PORT = process.env.PORT || 3000;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const app = express();
const webHookHandler = webhook({ path: "/webhook", secret: SECRET_TOKEN });

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
  // db.any("SELECT * FROM tasks WHERE task-status = $1", [false])
  //   .then(function (data) {
  //     // success;
  //     console.log(data);
  //   })
  //   .catch(function (error) {
  //     // error;
  //     console.log(error);
  //   });
  res.send(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started listening on port ${PORT}`);
});
