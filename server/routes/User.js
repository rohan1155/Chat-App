const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/Auth");

// Register
router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields must be provided" });
  }
  const user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    username,
    password: hashedPassword,
  });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
  res.status(201).json({ token, message: "User saved successfully" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields must be provided" });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.status(200).json({ token, message: "User logged in successfully" });
});

// Fetch current user
router.get("/current", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user.id;
    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete current user
router.delete("/current", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user.id;
    const deletedUser = await User.deleteOne({ _id: currentUser });
    if (!deletedUser.deletedCount) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all users or single user's name by userId
router.get("/users/:userId?", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user.id;
    const userId = req.params.userId;
    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ name: user.name });
    } else {
      const users = await User.find(
        { _id: { $ne: currentUser } },
        { password: 0 }
      );
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
