require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db'); 
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const initDb = require('./config/initDb');

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('Database connected successfully.');
    connection.release(); 
    initDb(); 
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); 
  }
})();

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  server.close(() => {
    console.log('Server has been shut down.');
    process.exit(0);
  });
});