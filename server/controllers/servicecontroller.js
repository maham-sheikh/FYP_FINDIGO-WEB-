const db = require('../config/db');

const getAllServices = async (req, res) => {
  try {
    const [services] = await db.query('SELECT id, name FROM services'); 
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const [service] = await db.query('SELECT id, name FROM services WHERE id = ?', [id]); 
    if (service.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

const addService = async (req, res) => {
  const { name } = req.body; 
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO services (name) VALUES (?)', 
      [name]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Failed to add service' });
  }
};

const updateService = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; 
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    await db.query('UPDATE services SET name = ? WHERE id = ?', [name, id]); 
    res.status(200).json({ id, name });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM services WHERE id = ?', [id]);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};