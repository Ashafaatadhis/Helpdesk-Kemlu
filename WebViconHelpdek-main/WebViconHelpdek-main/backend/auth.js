// backend/auth.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:8080", // frontend
  credentials: true,
}));

// debug env
console.log("ENV:", process.env.ADMIN_USER, process.env.ADMIN_PASS);

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || "secret123", { expiresIn: "2h" });
    return res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: { username },
    });
  }

  res.status(401).json({ success: false, message: "Username atau password salah" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Auth server running at http://localhost:${PORT}`));
