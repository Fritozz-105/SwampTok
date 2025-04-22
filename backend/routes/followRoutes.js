const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Follow a user
router.put('/:id', async (req, res) => {
  const { currentUserId } = req.body;
  const targetUserId = req.params.id;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  try {
    // Directly update the followers/following arrays without using .save()
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId }
    });

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId }
    });

    return res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    console.error(" Follow error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Unfollow a user
router.put('/unfollow/:id', async (req, res) => {
  const { currentUserId } = req.body;
  const targetUserId = req.params.id;

  try {
    // Directly remove the user from the arrays
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUserId }
    });

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: targetUserId }
    });

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error(" Unfollow error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;