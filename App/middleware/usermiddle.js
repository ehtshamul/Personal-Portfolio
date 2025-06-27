const jwt = require('jsonwebtoken');
const User = require('../models/admin/user'); // capitalized User to match convention

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header and remove "Bearer " prefix
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from decoded token
    const user = await User.findById(decoded.id).select('-password'); // fix method and field name

    if (!user) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
