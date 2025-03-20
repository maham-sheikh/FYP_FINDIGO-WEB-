const db = require("../config/db"); 

const vendorLogin = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ status: "error", message: "Phone and password are required." });
  }

  try {
    const query = "SELECT * FROM vendors WHERE phone = ?";

    const timeout = setTimeout(() => {
      console.error("Database query timed out");
      return res.status(500).json({ status: "error", message: "Database query timed out." });
    }, 5000); 

    db.query(query, [phone], (err, results) => {
      clearTimeout(timeout); 

      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: "error", message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ status: "error", message: "Invalid phone or password" });
      }

      const vendor = results[0];

      if (vendor.password !== password) {
        return res.status(401).json({ status: "error", message: "Invalid phone or password" });
      }

      if (vendor.status !== "approved") {
        return res.status(403).json({ status: "error", message: "Your account is not approved yet." });
      }

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        vendor: { id: vendor.id, phone: vendor.phone, name: vendor.name },
      });
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      console.error("Database connection error:", err);
    } else {
      console.log("Database connection test successful:", results);
    }
  });
};


module.exports = { vendorLogin };