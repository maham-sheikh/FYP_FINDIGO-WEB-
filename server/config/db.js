const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'findigo2',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

(async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Connected to the MySQL database successfully!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error.message);
    process.exit(1); 
  }
})();

module.exports = promisePool;