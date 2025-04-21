import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../tools/firebase";
import { LoginSchema, LoginFormData, validateAuth } from "../pages/Auth";
import BannerImage from "../assets/university-of-florida-entrance.jpg";
import GoogleIcon from "../assets/google-icon.svg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  const [authError, setAuthError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear auth error if user modifies fields after an error
    if (authError) {
      setAuthError("");
    }

    // Validate form on change
    const { isValid } = validateAuth(LoginSchema, {
      ...formData,
      [name]: value,
    });
    setIsFormValid(isValid);
  };

  // Validate form on submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAuth(LoginSchema, formData, setErrors);

    if (validation.isValid) {
      console.log("Login attempt with:", formData);

      // Add Login Logic Here
      login();
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError("");

      const provider = new GoogleAuthProvider();

      // Add scopes for better user data access
      provider.addScope("profile");
      provider.addScope("email");
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);

      const user = result.user;
      if (user?.uid) {
        console.log("Saving UID:", user.uid);
        localStorage.setItem("firebaseUid", user.uid);
        console.log("Saved UID:", localStorage.getItem("firebaseUid"));
      }

      // Redirect user to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Error during Google sign-in:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            // User closed the popup, no need to show error
            console.log("Popup was closed by the user");
            break;
          case "auth/cancelled-popup-request":
            // Another popup is already open
            console.log("Popup request was cancelled");
            break;
          case "auth/popup-blocked":
            setAuthError(
              "Sign-in popup was blocked by your browser. Please enable popups for this site."
            );
            break;
          case "auth/account-exists-with-different-credential":
            setAuthError(
              "An account already exists with a different sign-in method for this email."
            );
            break;
          case "auth/network-request-failed":
            setAuthError(
              "Network error. Please check your internet connection."
            );
            break;
          case "auth/user-disabled":
            setAuthError(
              "This account has been disabled. Please contact support."
            );
            break;
          default:
            setAuthError(`Failed to sign in with Google: ${error.message}`);
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login with email and password
  const login = async () => {
    try {
      setIsLoading(true);
      setAuthError("");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("User logged in:", userCredential.user);

      const user = userCredential.user;
      if (user?.uid) {
        console.log("Saving UID:", user.uid);
        localStorage.setItem("firebaseUid", user.uid);
        console.log("Saved UID:", localStorage.getItem("firebaseUid"));
      }
      // Redirect user to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-email":
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setAuthError("Invalid email or password. Please try again.");
            break;
          case "auth/user-disabled":
            setAuthError(
              "This account has been disabled. Please contact support."
            );
            break;
          case "auth/too-many-requests":
            setAuthError(
              "Too many unsuccessful login attempts. Please try again later or reset your password."
            );
            break;
          case "auth/network-request-failed":
            setAuthError(
              "Network error. Please check your internet connection."
            );
            break;
          default:
            setAuthError("Failed to sign in. Please try again.");
            break;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isValid = validateAuth(LoginSchema, formData).isValid;
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
                <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
                <p className="text-gray-300 text-lg">
                  Sign back in and reconnect with your campus community!
                  Discover the latest events, join new organizations, and see
                  what your friends have been up to!
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
                Don't have an account?{" "}
                <Link to="/signup" className="text-black font-medium underline">
                  Sign up
                </Link>
              </p>
            </div>

            <h2 className="text-3xl font-bold mb-8">Sign in</h2>

            {/* Google Sign In */}
            <div className="space-y-4 mb-8">
              <button
                type="button"
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
              <span className="flex-shrink mx-4 text-gray-600">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
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
                      errors.password ? "border-red-500" : "border-gray-300"
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

              {/* Forget Password Link */}
              <div className="mb-6 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Forget your password?
                </Link>
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
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-800"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-black font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
