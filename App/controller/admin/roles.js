const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/admin/user');
// const middleware=require('../../middleware/usermiddle')


// Admin Register
const adminreg = async (req, res) => {
  try {
    // Destructure body data
    const { username, email, password } = req.body;

    // Check if admin already exists (by username or email)
    const existsUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existsUser) {
      return res.status(401).json({
        message: "Admin already exists"
      });
    }

    // Create new admin
    const user = new User({ username, email, password });
    await user.save(); // ✅ Save the user to the database

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Send success response
    res.status(201).json({
      message: 'Admin created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// admin logig
// Admin Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    // Find user by username
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(400).json({
        message: "Invalid username or password"
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        message: 'Invalid username or password' 
      });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Send response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error. Please try again later.' 
    });
  }
};
// Get user
const profile= async  (req,res)=>{
     res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });

}



module.exports = { adminreg, login , profile};