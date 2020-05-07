const DB_URI = process.env.DB_URI;
const pgp = require("pg-promise")();
const db = pgp(DB_URI);

module.exports = (req, res) => {
  try {
    const { task_description } = req.body;
    const query = await db.none(
      "INSERT INTO tasks(task_description, task_iscomplete) VALUES($1, $2)",
      [task_description, false]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
  }
}