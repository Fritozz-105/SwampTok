import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { SignUpSchema, SignUpFormData, validateAuth, calculateAge } from '../pages/Auth';
import { auth } from '../tools/firebase';
import BannerImage from '../assets/university-of-florida-entrance.jpg';
import GoogleIcon from '../assets/google-icon.svg';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState<SignUpFormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
    const [authError, setAuthError] = useState<string>('');
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (errors[name as keyof SignUpFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Clear auth error if user modifies fields after an error
        if (authError) {
            setAuthError('');
        }

        // Validate form on change
        const { isValid } = validateAuth(SignUpSchema, {...formData, [name]: value});
        setIsFormValid(isValid);
    };

    // Validate form on submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateAuth(SignUpSchema, formData, setErrors);

        if (validation.isValid) {
            console.log('Signup attempt with:', formData);
            console.log('User age:', calculateAge(formData.dateOfBirth));

            // Add Signup Logic Here
            register();
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            setIsLoading(true);
            setAuthError('');

            const provider = new GoogleAuthProvider();

            // Add scopes for better user data access
            provider.addScope('profile');
            provider.addScope('email');
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            const result = await signInWithPopup(auth, provider);

            console.log("Google sign-up successful:", result.user);

            // Redirect user to home page after successful registration
            navigate('/');
        } catch (error) {
            console.error("Error during Google sign-up:", error);

            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        // User closed the popup, no need to show error
                        console.log("Popup was closed by the user");
                        break;
                    case 'auth/cancelled-popup-request':
                        // Another popup is already open
                        console.log("Popup request was cancelled");
                        break;
                    case 'auth/popup-blocked':
                        setAuthError('Sign-up popup was blocked by your browser. Please enable popups for this site.');
                        break;
                    case 'auth/account-exists-with-different-credential':
                        setAuthError('An account already exists with the same email. Try signing in instead.');
                        break;
                    case 'auth/network-request-failed':
                        setAuthError('Network error. Please check your internet connection.');
                        break;
                    default:
                        setAuthError(`Failed to sign up with Google: ${error.message}`);
                        break;
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const register = async () => {
        // Attempts to create user account with email and password
        try {
            // Sets state to loading to prevent multiple submissions
            setIsLoading(true);
            setAuthError('');

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            if (userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: formData.fullName
                });

                console.log('User registered:', userCredential.user);

                // Redirect user to home page after successful registration
                navigate('/');
            }
        } catch (error) {
            console.error('Error registering user:', error);

            // Display specific error message to user
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setAuthError('This email is already registered. Please sign in instead.');
                        break;
                    case 'auth/weak-password':
                        setAuthError('Please use a stronger password.');
                        break;
                    case 'auth/network-request-failed':
                        setAuthError('Network error. Please check your internet connection.');
                        break;
                    default:
                        setAuthError('Failed to create account. Please try again.');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow flex">

                {/* Left Half Banner and Text */}
                <div className="hidden lg:block w-1/2 bg-gray-900 relative">
                    <img
                        src={BannerImage}
                        alt="University of Florida entrance"
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-blue-800/50"></div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/40 z-20">
                        <div className="p-12 text-white relative z-30 h-full flex flex-col justify-center">
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold mb-6">
                                    Join Our Community
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Sign up today and connect with your campus community! Discover events, join organizations, and make new friends at the University of Florida.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side with Signup Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="text-right mb-4">
                            <p className="text-gray-600">
                                Already have an account? <Link to="/login" className="text-black font-medium underline">Sign in</Link>
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold mb-8">Create Account</h2>

                        {/* Google Sign Up */}
                        <div className="space-y-4 mb-8">
                            <button
                                type='button'
                                onClick={handleGoogleSignUp}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <img
                                    src={GoogleIcon}
                                    alt="Google icon"
                                    className="w-5 h-5 mr-3"
                                />
                                Sign up with Google
                            </button>
                        </div>

                        {/* OR Separator */}
                        <div className="relative flex items-center my-8">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-600">
                                OR
                            </span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            {/* Full Name Field */}
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black ${
                                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black pr-10 ${
                                            errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black pr-10 ${
                                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Date of Birth Field */}
                            <div className="mb-6">
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black ${
                                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.dateOfBirth && (
                                    <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                                )}
                            </div>

                            {/* Auth Error Message */}
                            {authError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{authError}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full font-medium py-3 px-4 rounded-md transition-colors mb-4 ${
                                    isFormValid
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-300 text-gray-800'
                                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <p className="text-xs text-gray-500 mt-4">
                                By signing up, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignUp;
