const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log(`Error from connecting Database ${err}`);
  } else {
    console.log(`Database Connected `);
    connection.release();
  }
});

module.exports = pool;
