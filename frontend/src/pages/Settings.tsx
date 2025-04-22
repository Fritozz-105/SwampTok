import React, { useState, useEffect, useRef } from "react";
import { updateUserProfile, getUserData } from "../tools/api";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import { Check, Upload, Loader2 } from "lucide-react";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../tools/firebase";
import { PasswordChangeSchema, PasswordChangeFormData } from "../pages/Auth";
import { validateAuth } from "../pages/Auth/validation";

// List of pre-defined interests that users can select from
const AVAILABLE_INTERESTS = [
    "Basketball", "Football", "Soccer", "Tennis", "Swimming",
    "Anime", "Gaming", "Movies", "Music", "Reading",
    "Art", "Photography", "Cooking", "Hiking", "Travel",
    "Gym", "Yoga", "Dance", "Technology", "Fashion", "Chemistry",
    "Physics", "Mathematics", "Biology", "History", "Computer Science",
    "Psychology", "Philosophy", "Economics", "Politics", "Environment"
];

const Settings = () => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        displayName: "",
        bio: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser?.uid) {
                setLoading(true);
                try {
                    const response = await getUserData(currentUser.uid);
                    if (response.success && response.user) {
                        setFormData(prevState => ({
                            ...prevState,
                            displayName: response.user.displayName || "",
                            bio: response.user.bio || ""
                        }));
                        setSelectedInterests(response.user.interests || []);
                        if (response.user.photoURL) {
                            setImagePreview(response.user.photoURL);
                        }
                    } else {
                        setError(response.message || "Failed to fetch user data");
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : "An error occurred");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Reset any success or error messages when user types
        setSuccessMessage(null);
        setError(null);
        if (name === "currentPassword" || name === "newPassword" || name === "confirmPassword") {
            setPasswordErrors({});
        }
    };

    // Handle toggling interests
    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            } else {
                return [...prev, interest];
            }
        });
        setSuccessMessage(null);
        setError(null);
    };

    // Handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            // Check if file size is less than 5MB
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }

            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
            setError(null);
            setSuccessMessage(null);
        }
    };

    // Handle profile image upload
    const uploadProfileImage = async () => {
        if (!profileImage || !currentUser) return null;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Create a reference to the storage location
            const storageRef = ref(storage, `profile-images/${currentUser.uid}-${Date.now()}`);

            // Start upload task
            const uploadTask = uploadBytesResumable(storageRef, profileImage);

            // Listen for upload progress
            return new Promise<string>((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Track upload progress
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        setUploadProgress(progress);
                    },
                    (error) => {
                        // Handle errors
                        console.error('Upload error:', error);
                        reject(error);
                    },
                    async () => {
                        // Upload completed successfully
                        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                        setIsUploading(false);
                        resolve(downloadUrl);
                    }
                );
            });
        } catch (error) {
            setIsUploading(false);
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    // Handle username and bio update
    const handleProfileUpdate = async () => {
        if (!currentUser) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let photoURL = currentUser.photoURL;

            // Upload new profile image if selected
            if (profileImage) {
                photoURL = await uploadProfileImage();
            }

            // Update Firebase Auth profile
            await updateProfile(currentUser, {
                displayName: formData.displayName || undefined,
                photoURL: photoURL || undefined
            });

            // Update MongoDB profile
            const response = await updateUserProfile(currentUser.uid, {
                displayName: formData.displayName,
                photoURL: photoURL,
                bio: formData.bio,
                interests: selectedInterests
            });

            if (response.success) {
                setSuccessMessage("Profile updated successfully!");
            } else {
                setError(response.message || "Failed to update profile");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError(err instanceof Error ? err.message : "An error occurred while updating your profile");
        } finally {
            setLoading(false);
        }
    };

    // Handle password update
    const handlePasswordUpdate = async () => {
        if (!currentUser || !currentUser.email) return;

        setLoading(true);
        setSuccessMessage(null);

        // Extract password data to validate
        const passwordData: PasswordChangeFormData = {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword
        };

        // Validate password data using zod schema
        const validation = validateAuth(PasswordChangeSchema, passwordData, setPasswordErrors);

        if (!validation.isValid) {
            setLoading(false);
            return;
        }

        try {
            // Re-authenticate user before changing password
            const credential = EmailAuthProvider.credential(
                currentUser.email,
                formData.currentPassword
            );

            await reauthenticateWithCredential(currentUser, credential);

            // Update password
            await updatePassword(currentUser, formData.newPassword);

            setSuccessMessage("Password updated successfully!");

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
        } catch (err) {
            console.error("Error updating password:", err);

            // Handle specific Firebase errors
            if (err instanceof Error) {
                if (err.message.includes("auth/wrong-password")) {
                    setPasswordErrors({ currentPassword: "Current password is incorrect" });
                } else if (err.message.includes("auth/requires-recent-login")) {
                    setPasswordErrors({ currentPassword: "This operation is sensitive and requires recent authentication. Please log in again before retrying" });
                } else {
                    setError(err.message);
                }
            } else {
                setError("Failed to update password");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <p className="text-lg text-gray-700">Please sign in to access settings.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
                        <Check className="mr-2" size={18} />
                        {successMessage}
                    </div>
                )}

                {/* Profile Picture Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Picture Preview */}
                        <div className="relative w-32 h-32">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-3xl">
                                        {formData.displayName?.charAt(0) || currentUser.email?.charAt(0) || "?"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex flex-col">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            {isUploading ? (
                                <div className="mb-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-500">Uploading: {uploadProgress}%</p>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center mb-2"
                                >
                                    <Upload size={16} className="mr-2" />
                                    Choose New Photo
                                </button>
                            )}

                            <p className="text-xs text-gray-500">
                                JPEG, PNG or GIF. Max size 5MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Information Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

                    <div className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                name="displayName"
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Your display name"
                            />
                        </div>

                        {/* Bio Field */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Write something about yourself..."
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">
                                Let others know a bit about you.
                            </p>
                        </div>

                        {/* Interests Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {AVAILABLE_INTERESTS.map(interest => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-3 py-1 text-sm rounded-full transition-colors ${
                                            selectedInterests.includes(interest)
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-gray-500 mt-2">
                                Select interests to help connect with like-minded individuals.
                            </p>
                        </div>

                        {/* Update Profile Button */}
                        <button
                            type="button"
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Update Profile"
                            )}
                        </button>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                    <div className="space-y-4">
                        {/* Current Password Field */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter current password"
                            />
                            {passwordErrors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter new password"
                            />
                            {passwordErrors.newPassword ? (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1">
                                    Password must be at least 8 characters with 1 uppercase letter and 1 symbol.
                                </p>
                            )}
                        </div>

                        {/* Confirm New Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Confirm new password"
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Update Password Button */}
                        <button
                            type="button"
                            onClick={handlePasswordUpdate}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin mr-2" />
                                    Updating...
                                </>
                            ) : (
                                "Change Password"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
