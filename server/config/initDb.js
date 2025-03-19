const db = require('../config/db');

const createTables = async () => {
  try {
    const [usersTable] = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'findigo2' AND table_name = 'users'
    `);

    if (usersTable.length === 0) {
      await db.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          cnic VARCHAR(20),
          role ENUM('Vendor', 'Customer') NOT NULL
        );
      `);
      console.log('Users table created successfully.');
    } else {
      console.log('Users table already exists.');
    }

    const [categoriesTable] = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'findigo2' AND table_name = 'categories'
    `);

    if (categoriesTable.length === 0) {
      await db.query(`
        CREATE TABLE categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          service_id INT NOT NULL 
        )
      `);
      console.log('Categories table created successfully.');
    } else {
      console.log('Categories table already exists.');
    }

    const [servicesTable] = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'findigo2' AND table_name = 'services'
    `);

    if (servicesTable.length === 0) {
      await db.query(`
        CREATE TABLE services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `);
      console.log('Services table created successfully.');
    } else {
      console.log('Services table already exists.');
    }

    const [vendorsTable] = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'findigo2' AND table_name = 'vendors'
    `);

    if (vendorsTable.length === 0) {
      await db.query(`
        CREATE TABLE vendors (
          id INT AUTO_INCREMENT PRIMARY KEY,
          fullName VARCHAR(255) NOT NULL,
          cnic VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          gender ENUM('Male', 'Female', 'Other') NOT NULL,
          address VARCHAR(255) NOT NULL,
          postalCode VARCHAR(20),
          city VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          businessCategory VARCHAR(255) NOT NULL,
          subService VARCHAR(255) NOT NULL,
          status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
        )
      `);
      console.log('Vendors table created successfully.');
    } else {
      console.log('Vendors table already exists.');
    }
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

module.exports = createTables;