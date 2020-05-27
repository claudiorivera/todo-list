require("dotenv").config();
const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const pgp = require("pg-promise")();

// Environmental variables
const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

// Instantiate express and postgres
const app = express();
const db = pgp(DB_URI);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// Routes
// GET /tasks - Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const query = await db.any("SELECT * FROM tasks ORDER BY id ASC");
    res.status(200).json(query);
  } catch (err) {
    console.log(err);
  }
});

// POST /tasks - Add a task
app.post("/tasks", async (req, res) => {
  try {
    const { task_description } = req.body;
    await db.none(
      "INSERT INTO tasks(task_description, task_iscomplete) VALUES($1, $2)",
      [task_description, false]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
});

// PUT /tasks/id - Mark a task completed
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { task_iscomplete } = req.body;
    await db.query("UPDATE tasks SET task_iscomplete = $1 WHERE id = $2", [
      task_iscomplete,
      id,
    ]);
    res.status(200).send(`User modified with ID: ${id}`);
  } catch (err) {
    console.log(err);
  }
});

// DELETE /tasks/id - Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.query("DELETE FROM tasks WHERE id = $1", id);
    res.status(200).send(`User deleted with ID: ${id}`);
  } catch (err) {
    console.log(err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started listening on port ${PORT}`);
});
