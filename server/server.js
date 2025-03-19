require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/vendor', vendorRoutes);

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
    await initDb(); 
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
})();


const HOST = "192.168.18.244";
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Server is shutting down...');
  server.close(() => {
    console.log('Server has been shut down.');
    process.exit(0);
  });
});
