import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Simple Navbar component
function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/');
        }
    };

    return (
        <nav className="bg-gray-800 dark:bg-gray-950 p-4 rounded-lg mb-8 transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-400 dark:text-blue-300">
                    UK-TalentScout
                </Link>
                <div className="space-x-4 flex items-center">
                    {/* Only show Home link when NOT logged in */}
                    {!user && (
                        <Link to="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100">
                            Home
                        </Link>
                    )}

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="text-gray-300 hover:text-white p-2"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                    
                    {user ? (
                        <>
                            {user.role === 'coach' ? (
                                <Link to="/dashboard" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100">
                                    Coach Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100">
                                        Other Athletes
                                    </Link>
                                    <Link to={`/athlete/${user._id}`} className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100">
                                        My Profile
                                    </Link>
                                </>
                            )}
                            <Link to="/edit-profile" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100">
                                Edit Profile
                            </Link>
                            <span className="text-gray-400 dark:text-gray-500">Welcome, {user.name}</span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 dark:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-gray-100">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors">
                                Create Profile
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;