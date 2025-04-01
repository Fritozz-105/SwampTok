const User = require('../models/User');

// Sync user data after Firebase authentication
const syncUser = async (req, res) => {
    try {
        const { firebaseUid, email, displayName, photoURL, dateOfBirth } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).json({ message: 'Firebase UID and email are required' });
        }

        // Find user by Firebase UID or create a new one
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
                    lastLogin: updatedUser.lastLogin
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

module.exports = {
    syncUser
};
