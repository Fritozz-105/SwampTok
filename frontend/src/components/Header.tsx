import { Link } from 'react-router-dom';
import Logo from '../../public/assets/logo.jpg';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm py-4 px-6">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                        <img
                            src={Logo}
                            alt="SwampTok Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-lg font-semibold">
                        SwampTok
                    </span>
                </Link>

                <nav className="hidden md:flex space-x-8">
                    <Link to="/projects" className="text-gray-600 hover:text-black">
                        Projects
                    </Link>
                    <Link to="/explore" className="text-gray-600 hover:text-black">
                        Explore
                    </Link>
                    <Link to="/resources" className="text-gray-600 hover:text-black">
                        Resources
                    </Link>
                    <Link to="/community" className="text-gray-600 hover:text-black">
                        Community
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-black">
                    Sign in
                </Link>
                <Link
                    to="/signup"
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Sign up
                </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
