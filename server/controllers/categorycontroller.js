const db = require('../config/db');

const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [category] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

const addCategory = async (req, res) => {
  const { name, service_id } = req.body; 
  if (!name || !service_id) {
    return res.status(400).json({ error: 'Name and service_id are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO categories (name, service_id) VALUES (?, ?)',
      [name, service_id]
    );
    res.status(201).json({ id: result.insertId, name, service_id });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, service_id } = req.body; 
  if (!name || !service_id) {
    return res.status(400).json({ error: 'Name and service_id are required' });
  }
  try {
    await db.query(
      'UPDATE categories SET name = ?, service_id = ? WHERE id = ?',
      [name, service_id, id]
    );
    res.status(200).json({ id, name, service_id });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};