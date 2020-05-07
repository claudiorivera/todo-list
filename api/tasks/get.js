const DB_URI = process.env.DB_URI;
const pgp = require("pg-promise")();
const db = pgp(DB_URI);

module.exports = async (req, res) => {
  try {
    const query = await db.any("SELECT * FROM tasks ORDER BY id ASC");
    res.status(200).json(query);
  } catch (err) {
    console.log(err);
  }
};
