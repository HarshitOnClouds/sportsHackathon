import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { SPORTS_LIST } from '../constants/sportsConstants';

function CoachDashboard() {
    const { user } = useAuth();
    // State for the filters
    const [filters, setFilters] = useState({
        name: '',
        sport: '',
        district: '',
        age: '',
    });

    // State to hold the list of athletes from the API
    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // This useEffect will run when the 'filters' state changes
    useEffect(() => {
        const fetchAthletes = async () => {
            setLoading(true);
            setError(null);

            try {
                // Build the query string from the filters
                const params = new URLSearchParams();
                if (filters.sport) params.append('sport', filters.sport);
                if (filters.district) params.append('district', filters.district);
                if (filters.age) params.append('age', filters.age);

                const apiUrl = `http://localhost:3001/api/users/athletes`;
                const res = await axios.get(apiUrl, { params });

                // Filter by name on the client side
                let filteredAthletes = res.data;
                if (filters.name) {
                    filteredAthletes = filteredAthletes.filter(athlete =>
                        athlete.name.toLowerCase().includes(filters.name.toLowerCase())
                    );
                }

                setAthletes(filteredAthletes);
            } catch (err) {
                setError('Failed to fetch athletes. Please try again.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchAthletes();
    }, [filters]); // Dependency array: re-run this effect when 'filters' changes

    // Handler to update the filters state
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
                {user?.role === 'coach' ? 'Coach Dashboard' : 'Other Athletes'}
            </h1>

            {/* --- SUMMARY STATS --- */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">Total Athletes</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-200">{athletes.length}</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-300 font-medium">Unique Sports</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-200">
                            {[...new Set(athletes.map(a => a.sport))].length}
                        </p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 dark:text-purple-300 font-medium">Districts</p>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-200">
                            {[...new Set(athletes.map(a => a.district))].length}
                        </p>
                    </div>
                </div>
            )}

            {/* --- FILTERS --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                {/* Name Search */}
                <div className="flex-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="e.g., John Doe"
                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sport Filter */}
                <div className="flex-1">
                    <label htmlFor="sport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sport</label>
                    <select
                        name="sport"
                        id="sport"
                        value={filters.sport}
                        onChange={handleFilterChange}
                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Sports</option>
                        {SPORTS_LIST.filter(sport => sport !== "Select a Sport").map((sport) => (
                            <option key={sport} value={sport}>
                                {sport}
                            </option>
                        ))}
                    </select>
                </div>

                {/* District Filter */}
                <div className="flex-1">
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                    <input
                        type="text"
                        name="district"
                        id="district"
                        value={filters.district}
                        onChange={handleFilterChange}
                        placeholder="e.g., Dehradun"
                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Age Filter */}
                <div className="flex-1">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Age</label>
                    <input
                        type="number"
                        name="age"
                        id="age"
                        value={filters.age}
                        onChange={handleFilterChange}
                        placeholder="e.g., 18"
                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                    <button
                        onClick={() => setFilters({ name: '', sport: '', district: '', age: '' })}
                        className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* --- RESULTS --- */}
            <div className="mt-4">
                {loading && <LoadingSpinner />}
                {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative text-center">{error}</div>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {athletes.length === 0 ? (
                            <p className="col-span-full text-center text-gray-600 dark:text-gray-400">No athletes found matching your criteria.</p>
                        ) : (
                            athletes.map(athlete => (
                                <div key={athlete._id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col justify-between transition-colors duration-300">
                                    <div>
                                        <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">{athlete.name}</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{athlete.sport}</p>
                                        <p className="text-gray-600 dark:text-gray-400">{athlete.district} | Age: {athlete.age}</p>
                                    </div>

                                    {/* This links to the Athlete's profile page - the "wow" feature! */}
                                    <Link
                                        to={`/athlete/${athlete._id}`}
                                        className="mt-4 inline-block text-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                    >
                                        View Analytics
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CoachDashboard;