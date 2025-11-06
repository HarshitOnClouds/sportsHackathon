import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Simple Navbar component
function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 p-4 rounded-lg mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-400">
                    UK-TalentScout
                </Link>
                <div className="space-x-4 flex items-center">
                    <Link to="/" className="text-gray-300 hover:text-white">
                        Home
                    </Link>
                    
                    {user ? (
                        <>
                            {user.role === 'coach' ? (
                                <Link to="/dashboard" className="text-gray-300 hover:text-white">
                                    Coach Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-white">
                                        Other Athletes
                                    </Link>
                                    <Link to={`/athlete/${user._id}`} className="text-gray-300 hover:text-white">
                                        My Profile
                                    </Link>
                                </>
                            )}
                            <span className="text-gray-400">Welcome, {user.name}</span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
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