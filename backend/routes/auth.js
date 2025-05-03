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

// Update user with ADHD type
router.patch('/update-user', async (req, res) => {
  try {
    const { email, adhdType } = req.body;
    
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { adhdtype: adhdType } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user interests
router.put('/interests', async (req, res) => {
  try {
    const { email, interestSelected } = req.body;
    
    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { interests: interestSelected } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Interests updated successfully',
      interests: updatedUser.interests
    });
    
  } catch (error) {
    console.error('Interest update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user interests
router.get('/interests', async (req, res) => {
  try {
    const { email } = req.query;
    
    const user = await User.findOne(
      { email: email.toLowerCase().trim() },
      { interests: 1 }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      interests: user.interests || []
    });
    
  } catch (error) {
    console.error('Interest fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;