
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to handle errors
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Register
router.post('/register', asyncHandler(async (req, res) => {
  console.log('📝 Registration attempt with data:', {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  });

  // Validate request body
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    console.log('❌ Registration failed: Missing required fields');
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('❌ Registration failed: Email already exists:', email);
    return res.status(400).json({ message: 'User with this email already exists' });
  }

  // Create new user
  const user = new User({
    name,
    email,
    password,
    role: role || 'student' // Default to student if role not provided
  });

  try {
    await user.save();
    console.log('✅ User created successfully:', user._id);

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response without password
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ User save error:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: messages 
      });
    }
    
    throw error; // Let the global error handler handle it
  }
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  console.log('🔑 Login attempt for:', req.body.email);

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    console.log('❌ Login failed: User not found for email:', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    console.log('❌ Login failed: Invalid password for email:', email);
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Create token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  console.log('✅ Login successful for:', email);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}));

module.exports = router;
