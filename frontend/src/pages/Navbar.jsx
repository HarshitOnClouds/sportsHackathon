import React from 'react';
import { Link } from 'react-router-dom';

// Simple Navbar component
function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 rounded-lg mb-8">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-400">
                    UK-TalentScout
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white">
                        Home
                    </Link>
                    <Link to="/dashboard" className="text-gray-300 hover:text-white">
                        Coach Dashboard
                    </Link>
                    <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Create Profile
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;