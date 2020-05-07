const DB_URI = process.env.DB_URI;
const pgp = require("pg-promise")();
const db = pgp(DB_URI);

module.exports = get = async (req, res) => {
  try {
    const query = await db.any("SELECT * FROM tasks ORDER BY id ASC");
    res.status(200).json(query);
  } catch (err) {
    console.log(err);
  }
};

module.exports = post = async (req, res) => {
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
};
