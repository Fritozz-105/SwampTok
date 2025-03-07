import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Error404: React.FC = () => {
  const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow flex items-center justify-center p-6 bg-gray-50">
                <div className="max-w-lg w-full text-center px-4 py-10">
                    <h1 className="text-8xl font-bold text-gray-900 mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page not found</h2>

                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        The page you are looking for doesn't exist or has been moved.
                        Check the URL or try navigating back to the homepage.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                        to="/"
                        className="bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
                        >
                        Back to Home
                        </Link>
                        <button
                        onClick={() => navigate(-1)}
                        className="border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-md transition-colors"
                        >
                        Go Back
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Error404;
