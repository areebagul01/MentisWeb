const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
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

    // Here we will generate the token
    const token = jwt.sign(
      { userId: user._id, email: user.email },  // Payload (you can include any data you want)
      process.env.JWT_SECRET,                        // Secret key (replace this with an actual secret key)
      { expiresIn: '1m' }                       // Token expiration time (optional)
    );

    res.json({
      token,                                    // Send the token back to the client
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

// Tasks
router.post('/daily-tasks', async (req, res) => {
  try {
    const { email, adhd_type, interests } = req.body;
    
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate tasks (replace with your model logic)
    const daily_tasks = [
      "Break task into 15-minute chunks",
      "Use noise-cancelling headphones",
      "Set visual timer for tasks"
    ];

    // Update user with generated tasks
    await User.updateOne(
      { email },
      { $set: { dailyTasks: daily_tasks, lastTaskDate: new Date() } }
    );

    res.json({
      daily_tasks,
      selected_interest: user.interests[0],
      date: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// For getting user details
router.get('/user', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    console.log(email);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    console.log(user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      adhdtype: user.adhdtype
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update-profile', async (req, res) => {
  try {
    const { email, username, dateOfBirth, gender } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: { username, dateOfBirth, gender } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;