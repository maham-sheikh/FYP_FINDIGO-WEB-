const db = require('../config/db');
const { sendEmail } = require('../utils/email');

const submitBusiness = async (req, res) => {
  const {
    fullName,
    cnic,
    email,
    phone,
    gender,
    address,
    postalCode,
    city,
    password,
    businessCategory,
    subService,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO vendors (fullName, cnic, email, phone, gender, address, postalCode, city, password, businessCategory, subService, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [fullName, cnic, email, phone, gender, address, postalCode, city, password, businessCategory, subService]
    );
    res.status(201).json({ message: 'Business submitted for approval!', id: result.insertId });
  } catch (error) {
    console.error('Error submitting business:', error);
    res.status(500).json({ error: 'Failed to submit business' });
  }
};

const getUnverifiedBusinesses = async (req, res) => {
  try {
    const [businesses] = await db.query(
      `SELECT * FROM vendors WHERE status = 'pending' OR status = 'rejected'`
    );
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.status(200).json(businesses);
  } catch (error) {
    console.error('Error fetching unverified businesses:', error);
    res.status(500).json({ error: 'Failed to fetch unverified businesses' });
  }
};

const getVerifiedBusinesses = async (req, res) => {
  try {
    const [businesses] = await db.query(
      `SELECT * FROM vendors WHERE status = 'approved'`
    );
     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
     res.setHeader('Pragma', 'no-cache');
     res.setHeader('Expires', '0');

    res.status(200).json(businesses);
  } catch (error) {
    console.error('Error fetching verified businesses:', error);
    res.status(500).json({ error: 'Failed to fetch verified businesses' });
  }
};

// Approve a business
const approveBusiness = async (req, res) => {
  const { id } = req.body;

  try {
    await db.query(
      `UPDATE vendors SET status = 'approved' WHERE id = ?`,
      [id]
    );

    const [vendor] = await db.query(
      `SELECT email FROM vendors WHERE id = ?`,
      [id]
    );

    if (vendor.length > 0) {
      const vendorEmail = vendor[0].email;

      const subject = 'Your Business Has Been Approved';
      const text = 'Congratulations! Your business has been approved. You can now log in to the Findigo app.';

      await sendEmail(vendorEmail, subject, text);
    }

    res.status(200).json({ message: 'Business approved successfully!' });
  } catch (error) {
    console.error('Error approving business:', error);
    res.status(500).json({ error: 'Failed to approve business' });
  }
};

// Reject a business
const rejectBusiness = async (req, res) => {
  const { id } = req.body;

  try {
    await db.query(
      `UPDATE vendors SET status = 'rejected' WHERE id = ?`,
      [id]
    );

    // Fetch the vendor's email
    const [vendor] = await db.query(
      `SELECT email FROM vendors WHERE id = ?`,
      [id]
    );

    if (vendor.length > 0) {
      const vendorEmail = vendor[0].email;

      // Send an email to the vendor
      const subject = 'Your Business Has Been Rejected';
      const text = 'We regret to inform you that your business application has been rejected. Please contact support for further details.';

      await sendEmail(vendorEmail, subject, text);
    }

    res.status(200).json({ message: 'Business rejected successfully!' });
  } catch (error) {
    console.error('Error rejecting business:', error);
    res.status(500).json({ error: 'Failed to reject business' });
  }
};

module.exports = {
  submitBusiness,
  getUnverifiedBusinesses,
  getVerifiedBusinesses,
  approveBusiness,
  rejectBusiness,
};