import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

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
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold mb-6 text-blue-400">
                {user?.role === 'coach' ? 'Coach Dashboard' : 'Other Athletes'}
            </h1>

            {/* --- FILTERS --- */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-700 rounded-lg">
                {/* Name Search */}
                <div className="flex-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Search by Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        placeholder="e.g., John Doe"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sport Filter */}
                <div className="flex-1">
                    <label htmlFor="sport" className="block text-sm font-medium text-gray-300 mb-1">Sport</label>
                    <input
                        type="text"
                        name="sport"
                        id="sport"
                        value={filters.sport}
                        onChange={handleFilterChange}
                        placeholder="e.g., Sprinting"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* District Filter */}
                <div className="flex-1">
                    <label htmlFor="district" className="block text-sm font-medium text-gray-300 mb-1">District</label>
                    <input
                        type="text"
                        name="district"
                        id="district"
                        value={filters.district}
                        onChange={handleFilterChange}
                        placeholder="e.g., Dehradun"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Age Filter */}
                <div className="flex-1">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Max Age</label>
                    <input
                        type="number"
                        name="age"
                        id="age"
                        value={filters.age}
                        onChange={handleFilterChange}
                        placeholder="e.g., 18"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* --- RESULTS --- */}
            <div className="mt-4">
                {loading && <LoadingSpinner />}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">{error}</div>}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {athletes.length === 0 ? (
                            <p className="col-span-full text-center text-gray-400">No athletes found matching your criteria.</p>
                        ) : (
                            athletes.map(athlete => (
                                <div key={athlete._id} className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-green-400">{athlete.name}</h3>
                                        <p className="text-gray-300">{athlete.sport}</p>
                                        <p className="text-gray-400">{athlete.district} | Age: {athlete.age}</p>
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