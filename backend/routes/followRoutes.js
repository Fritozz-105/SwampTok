const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Follow a user
router.put('/:firebaseUid', async (req, res) => {
  const { currentUserId } = req.body;
  const targetFirebaseUid = req.params.firebaseUid;

  if (currentUserId === targetFirebaseUid) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  try {
    // Find users by Firebase UIDs
    const targetUser = await User.findOne({ firebaseUid: targetFirebaseUid });
    const currentUser = await User.findOne({ firebaseUid: currentUserId });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Add to followers/following arrays if not already present
    if (!targetUser.followers.includes(currentUser.firebaseUid)) {
      targetUser.followers.push(currentUser.firebaseUid);
      await targetUser.save();
    }

    if (!currentUser.following.includes(targetUser.firebaseUid)) {
      currentUser.following.push(targetUser.firebaseUid);
      await currentUser.save();
    }

    return res.status(200).json({ message: "Followed successfully" });
  } catch (err) {
    console.error("Follow error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Unfollow a user
router.put('/unfollow/:firebaseUid', async (req, res) => {
  const { currentUserId } = req.body;
  const targetFirebaseUid = req.params.firebaseUid;

  try {
    // Find users by Firebase UIDs
    const targetUser = await User.findOne({ firebaseUid: targetFirebaseUid });
    const currentUser = await User.findOne({ firebaseUid: currentUserId });

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Remove from followers/following arrays
    targetUser.followers = targetUser.followers.filter(uid => uid !== currentUser.firebaseUid);
    currentUser.following = currentUser.following.filter(uid => uid !== targetUser.firebaseUid);

    await targetUser.save();
    await currentUser.save();

    return res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
