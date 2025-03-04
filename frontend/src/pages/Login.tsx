import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BannerImage from '../../public/assets/university-of-florida-entrance.jpg';
import GoogleIcon from '../../public/assets/google-icon.svg';

const LoginPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        // At least 8 characters, 1 uppercase, 1 symbol
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        console.log('Google Sign In');
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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        const newErrors = {
            email: '',
            password: ''
        };

        // Validate email
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Validate password
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with 1 uppercase letter and 1 symbol';
        }

        setErrors(newErrors);

        // If no errors, proceed with login
        if (!newErrors.email && !newErrors.password) {
            console.log('Login attempt with:', formData);

            {/* Add Login Logic Here */}
        }
    };

    useEffect(() => {
        const isValid = validateEmail(formData.email) && validatePassword(formData.password);
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
                                    Welcome Back!
                                </h1>
                                <p className="text-gray-300 text-lg">
                                    Sign back in and reconnect with your campus community! Discover the latest events, join new organizations, and see what your friends have been up to!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side with Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                    <div className="w-full max-w-md">
                        <div className="text-right mb-4">
                            <p className="text-gray-600">
                                Don't have an account? <Link to="/signup" className="text-black font-medium underline">Sign up</Link>
                            </p>
                        </div>

                        <h2 className="text-3xl font-bold mb-8">Sign in</h2>


                        {/* Implement Google Sign In */}

                        <div className="space-y-4 mb-8">
                            <button
                                type='button'
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center border border-gray-300 rounded-md py-3 px-4 text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <img
                                    src={GoogleIcon}
                                    alt="Google icon"
                                    className="w-5 h-5 mr-3"
                                />
                                Continue with Google
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
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Email Address
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

                            <div className="mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Your Password
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

                            {/* Handle Forget Password */}

                            <div className="mb-6 text-right">
                                <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-black">
                                Forget your password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className={`w-full font-medium py-3 px-4 rounded-md transition-colors mb-4 ${
                                    isFormValid
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                        : 'bg-gray-300 text-gray-800'
                                }`}
                            >
                                Sign in
                            </button>

                            {/* Handle Sign Up */}

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                Don't have an account? <Link to="/signup" className="text-black font-medium">Sign up</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
