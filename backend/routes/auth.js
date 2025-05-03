const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: trimmedEmail });
    
    if (!user) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    if (user.password !== password.trim()) {
      return res.status(400).json({ message: 'Incorrect Password' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      adhdtype: user.adhdtype,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      interests: user.interests,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, dateOfBirth, gender } = req.body;
    
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    // Check for existing user
    const existingUser = await User.findOne({ 
      $or: [
        { email: trimmedEmail },
        { username: trimmedUsername }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === trimmedEmail 
          ? 'Email already exists' 
          : 'Username already exists'
      });
    }

    // Create new user
    const newUser = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password: password.trim(),
      dateOfBirth: dateOfBirth || null,
      gender: gender || null
    });

    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      adhdtype: newUser.adhdtype,
      dateOfBirth: newUser.dateOfBirth,
      gender: newUser.gender,
      interests: newUser.interests,
      createdAt: newUser.createdAt
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;