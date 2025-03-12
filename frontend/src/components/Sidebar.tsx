import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Globe, Calendar, User, Settings, HelpCircle, LogIn } from 'lucide-react';
import Logo from '../assets/logo.jpg';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-0 z-40 flex flex-col">
            {/* Logo and Title */}
            <div className="px-5 py-6 flex items-center">
                <Link to="/" className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                            src={Logo}
                            alt="SwampTok Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-lg font-semibold ml-3">SwampTok</span>
                </Link>
            </div>

            <nav className="mt-8 flex-grow">
                <div className="px-4 space-y-2">
                    {/* Home */}
                    <Link
                        to="/"
                        className={`flex items-center py-3 px-4 rounded-md ${
                            isActive('/')
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Home size={22} strokeWidth={1.75} />
                        <span className="ml-4">Home</span>
                    </Link>

                    {/* Search */}
                    <Link
                        to="/search"
                        className={`flex items-center py-3 px-4 rounded-md ${
                            isActive('/search')
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Search size={22} strokeWidth={1.75} />
                        <span className="ml-4">Search</span>
                    </Link>

                    {/* Explore */}
                    <Link
                        to="/explore"
                        className={`flex items-center py-3 px-4 rounded-md ${
                            isActive('/explore')
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Globe size={22} strokeWidth={1.75} />
                        <span className="ml-4">Explore</span>
                    </Link>

                    {/* Calendar */}
                    <Link
                        to="/calendar"
                        className={`flex items-center py-3 px-4 rounded-md ${
                            isActive('/calendar')
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <Calendar size={22} strokeWidth={1.75} />
                        <span className="ml-4">Calendar</span>
                    </Link>

                    {/* Profile */}
                    <Link
                        to="/profile"
                        className={`flex items-center py-3 px-4 rounded-md ${
                            isActive('/profile')
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <User size={22} strokeWidth={1.75} />
                        <span className="ml-4">Profile</span>
                    </Link>
                </div>
            </nav>

            <div className="mt-auto border-t border-gray-200 py-4 px-4">
                <div className="space-y-2">
                    {/* Settings */}
                    <Link
                        to="/settings"
                        className="flex items-center py-3 px-4 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <Settings size={22} strokeWidth={1.75} />
                        <span className="ml-4">Settings</span>
                    </Link>

                    {/* Help */}
                    <Link
                        to="/help"
                        className="flex items-center py-3 px-4 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <HelpCircle size={22} strokeWidth={1.75} />
                        <span className="ml-4">Help</span>
                    </Link>

                    {/* Login Link */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <Link
                            to="/login"
                            className="flex items-center py-3 px-4 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            <LogIn size={22} strokeWidth={1.75} />
                            <span className="ml-4">Sign in</span>
                        </Link>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
