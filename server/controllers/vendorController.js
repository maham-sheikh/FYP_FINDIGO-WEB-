const db = require("../config/db"); 

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required." });
  }

  try {
    console.log("Querying database for vendor:", email);
    const query = "SELECT * FROM vendors WHERE LOWER(email) = LOWER(?)";

    const timeout = setTimeout(() => {
      console.error("Database query timed out");
      return res.status(500).json({ status: "error", message: "Database query timed out." });
    }, 5000); // 5-second timeout

    db.query(query, [email], (err, results) => {
      clearTimeout(timeout); 

      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ status: "error", message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ status: "error", message: "Invalid email or password" });
      }

      const vendor = results[0];

      if (vendor.password !== password) {
        return res.status(401).json({ status: "error", message: "Invalid email or password" });
      }

      if (vendor.status !== "approved") {
        return res.status(403).json({ status: "error", message: "Your account is not approved yet." });
      }

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        vendor: { id: vendor.id, email: vendor.email, name: vendor.name },
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