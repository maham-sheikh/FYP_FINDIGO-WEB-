const express = require("express");
const db = require("../config/db");
const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    const [results] = await db.query("SELECT 1 + 1 AS result");
    console.log("Database connection test successful:", results);
    return res.status(200).json({ status: "success", data: results });
  } catch (err) {
    console.error("Database connection error:", err);
    return res.status(500).json({ status: "error", message: "Database connection failed." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Email and password are required." });
  }

  try {
    console.log("Querying database for vendor:", email);
    const query = "SELECT * FROM vendors WHERE LOWER(email) = LOWER(?)";

    const [results] = await db.query(query, [email]);

    console.log("Database query results:", results);

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

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

module.exports = router;
