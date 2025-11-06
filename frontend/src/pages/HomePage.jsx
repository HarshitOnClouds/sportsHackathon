import React from 'react';
import { Link } from 'react-router-dom';

// This is the new homepage for the '/' route
function HomePage() {
    return (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to UK-TalentScout</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Connecting Uttarakhand's athletes with coaches and opportunities.
            </p>

            <div className="flex justify-center gap-6">
                {/* Card for Coaches */}
                <Link
                    to="/dashboard"
                    className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg w-64 text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
                >
                    <h2 className="text-2xl font-semibold mb-2 text-blue-600 dark:text-blue-400">Are you a Coach?</h2>
                    <p className="text-gray-700 dark:text-gray-300">Discover and filter through the next generation of talent.</p>
                </Link>

                {/* Card for Athletes */}
                <Link
                    to="/signup"
                    className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg w-64 text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-300"
                >
                    <h2 className="text-2xl font-semibold mb-2 text-green-600 dark:text-green-400">Are you an Athlete?</h2>
                    <p className="text-gray-700 dark:text-gray-300">Create your profile and get discovered by coaches.</p>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;