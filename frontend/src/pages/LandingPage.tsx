import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Logo from '../assets/logo.jpg';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-full mx-auto border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                        <img
                            src={Logo}
                            alt="SwampTok Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="mt-4 text-2xl font-bold text-gray-900">Welcome to SwampTok</h1>
                    <p className="mt-2 text-gray-600">Connect with your campus community</p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/login"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
                    >
                    <LogIn size={20} />
                        Sign in
                    </Link>

                    <div className="text-center text-sm text-gray-600">
                        New to SwampTok? <Link to="/signup" className="text-blue-600 hover:underline">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
