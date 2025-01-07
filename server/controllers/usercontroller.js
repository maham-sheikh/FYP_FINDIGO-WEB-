const db = require('../config/db');

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const addUser = async (req, res) => {
  const { name, email, phone, cnic, role } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, phone, cnic, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, cnic, role]
    );
    res.status(201).json({ id: result.insertId, name, email, phone, cnic, role });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};

const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, cnic, role } = req.body;
  try {
    await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, cnic = ?, role = ? WHERE id = ?',
      [name, email, phone, cnic, role, id]
    );
    res.status(200).json({ id, name, email, phone, cnic, role });
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Failed to edit user' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  addUser,
  editUser,
  deleteUser,
};