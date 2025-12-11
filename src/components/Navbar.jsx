import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <i className="fas fa-robot text-xl text-blue-500"></i>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">GrokMemeHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="navbar-link">
                            Home
                        </Link>
                        <Link to="/search" className="navbar-link">
                            Search
                        </Link>
                        {isAuthenticated && (
                            <Link to="/my-memes" className="navbar-link">
                                My Memes
                            </Link>
                        )}

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <i className="fas fa-sun text-yellow-400"></i>
                            ) : (
                                <i className="fas fa-moon text-gray-600"></i>
                            )}
                        </button>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    @{user?.username}
                                </span>
                                <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2"
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? (
                                <i className="fas fa-sun text-yellow-400"></i>
                            ) : (
                                <i className="fas fa-moon text-gray-600"></i>
                            )}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2"
                            aria-label="Toggle menu"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-gray-700 dark:text-gray-300`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-3">
                        <Link to="/" className="block py-2 text-sm navbar-link" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                        <Link to="/search" className="block py-2 text-sm navbar-link" onClick={() => setIsOpen(false)}>
                            Search
                        </Link>
                        {isAuthenticated && (
                            <Link to="/my-memes" className="block py-2 text-sm navbar-link" onClick={() => setIsOpen(false)}>
                                My Memes
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                                    <span className="block text-sm text-gray-600 dark:text-gray-400 py-2">
                                        @{user?.username}
                                    </span>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="block w-full text-left py-2 text-sm navbar-link"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block py-2 text-sm navbar-link" onClick={() => setIsOpen(false)}>
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary block text-center text-sm" onClick={() => setIsOpen(false)}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
