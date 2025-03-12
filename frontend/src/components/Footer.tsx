import { Link } from 'react-router-dom';
import Linkedin from '../assets/linkedin-logo.png';
import Github from '../assets/github-logo.svg';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            Resources
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/blog" className="text-gray-600 hover:text-black">Blog</Link>
                            </li>
                            <li>
                                <Link to="/help" className="text-gray-600 hover:text-black">Help Center</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            Company
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-black">About</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-600 hover:text-black">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-3">
                            Legal
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="text-gray-600 hover:text-black">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-600 hover:text-black">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm mb-4 md:mb-0">
                        © 2025 SwampTok Corp. All rights reserved.
                    </p>
                    <div className="flex space-x-5">
                        <a href='https://github.com/Fritozz-105/SwampTok.git' className="text-black hover:text-gray-500 transition-colors duration-200">
                            <span className="sr-only">GitHub</span>
                            <img
                                src={Github}
                                alt="GitHub logo"
                                className="h-5 w-5 object-contain opacity-100 hover:opacity-70 transition-opacity duration-200"
                            />
                        </a>
                        <a href='https://linkedin.com' className="text-black hover:text-gray-500 transition-colors duration-200">
                            <span className="sr-only">LinkedIn</span>
                            <img
                                src={Linkedin}
                                alt="LinkedIn logo"
                                className="h-5 w-5 object-contain opacity-100 hover:opacity-70 transition-opacity duration-200"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
