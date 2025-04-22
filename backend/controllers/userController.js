const User = require('../models/User');

// GET user by Firebase UID
const getUserByFirebaseUid = async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ensure followers and following are always included
    const safeUser = {
      ...user.toObject(),
      followers: user.followers || [],
      following: user.following || [],
    };

    return res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// SYNC user (create or update)
const syncUser = async (req, res) => {
  try {
    const { firebaseUid, email, displayName, photoURL, dateOfBirth } = req.body;

    if (!firebaseUid || !email) {
      return res.status(400).json({ message: 'Firebase UID and email are required' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      {
        email,
        displayName,
        photoURL,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        lastLogin: new Date()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        firebaseUid: updatedUser.firebaseUid,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        dateOfBirth: updatedUser.dateOfBirth,
        lastLogin: updatedUser.lastLogin,
        followers: updatedUser.followers || [],
        following: updatedUser.following || []
      }
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while syncing user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const updateUser = async (req, res) => {
    try {
        const { firebaseUid } = req.params;
        const { displayName, bio, interests, photoURL } = req.body;

        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update only the fields provided in the request
        if (displayName !== undefined) user.displayName = displayName;
        if (bio !== undefined) user.bio = bio;
        if (interests !== undefined) user.interests = interests;
        if (photoURL !== undefined) user.photoURL = photoURL;

        await user.save();

        return res.json({
            success: true,
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    syncUser,
    getUserByFirebaseUid,
    updateUser
};
