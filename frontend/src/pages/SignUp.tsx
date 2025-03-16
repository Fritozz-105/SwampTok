import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BannerImage from '../assets/university-of-florida-entrance.jpg';
import GoogleIcon from '../assets/google-icon.svg';
import { signupUser } from '../api/api.ts';

const SignUp: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });
    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Validation functions
    const validateFullName = (name: string): boolean => {
        return name.trim().length >= 2;
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        // At least 8 characters, 1 uppercase, 1 symbol
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
        return password === confirmPassword;
    };

    const validateDateOfBirth = (dob: string): boolean => {
        if (!dob) return false;

        const birthDate = new Date(dob);
        const today = new Date();

        // Check if date is valid
        if (isNaN(birthDate.getTime())) return false;

        // Check if birthdate is in the future
        if (birthDate > today) return false;

        // Calculate age
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // If birth month hasn't occurred this year yet, subtract a year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 17; // Must be at least 13 years old
        }

        return age >= 17; // Must be at least 17 years old
    };

    // Get age from DOB
    const calculateAge = (dob: string): number => {
        if (!dob) return 0;

        const birthDate = new Date(dob);
        const today = new Date();

        if (isNaN(birthDate.getTime())) return 0;

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    // Handle Google Sign Up
    const handleGoogleSignUp = async () => {
        console.log('Google Sign Up');
    };

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    // Validate form on submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        const newErrors = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            dateOfBirth: ''
        };

        // Validate full name
        if (!validateFullName(formData.fullName)) {
            newErrors.fullName = 'Please enter your full name (minimum 2 characters)';
        }

        // Validate email
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Validate password
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with 1 uppercase letter and 1 symbol';
        }

        // Validate confirm password
        if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Validate date of birth
        if (!validateDateOfBirth(formData.dateOfBirth)) {
            newErrors.dateOfBirth = 'You must be at least 17 years old to sign up';
        }

        setErrors(newErrors);

        // If no errors, proceed with signup
        
        if (!newErrors.fullName && !newErrors.email && !newErrors.password &&
            !newErrors.confirmPassword && !newErrors.dateOfBirth) {
            console.log('Signup attempt with:', formData);
            console.log('User age:', calculateAge(formData.dateOfBirth));

            {/* Add Signup Logic Here */}
            setIsLoading(true);
            try {
                console.log('Trying to send data.')
                const result = await signupUser({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    dateOfBirth: formData.dateOfBirth
                });
                console.log('Signup successful:', result);
                // Handle success (maybe redirect to login or dashboard)
            } catch (error) {
                console.error('Signup failed:', error);
                // Handle error (show error message to user)
            } finally {
                setIsLoading(false); // Stop loading
            }

        }
    };

    useEffect(() => {
        const isValid =
            validateFullName(formData.fullName) &&
            validateEmail(formData.email) &&
            validatePassword(formData.password) &&
            validateConfirmPassword(formData.password, formData.confirmPassword) &&
            validateDateOfBirth(formData.dateOfBirth);

        setIsFormValid(isValid);
    }, [formData]);

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
