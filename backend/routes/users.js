// backend/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add your user routes here
router.put('/interests', async (req, res) => {
  try {
    const { email, interests } = req.body;
    
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { interests } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;