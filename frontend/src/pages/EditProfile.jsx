import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { SPORTS_LIST } from '../constants/sportsConstants';

const EditProfile = () => {
    const { user, login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        district: '',
        sport: '',
        age: '',
        team: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                district: user.district || '',
                sport: user.sport || '',
                age: user.age || '',
                team: user.team || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validate sport selection for athletes
        if (user.role === 'athlete' && (!formData.sport || formData.sport === 'Select a Sport')) {
            setError('Please select a valid sport');
            showToast('Please select a valid sport', 'error');
            setLoading(false);
            return;
        }

        try {
            // Prepare data to send
            const updateData = {
                name: formData.name,
                district: formData.district,
            };

            if (user.role === 'athlete') {
                updateData.sport = formData.sport;
                updateData.age = formData.age;
            } else if (user.role === 'coach') {
                updateData.team = formData.team;
            }

            const response = await fetch(`http://localhost:3001/api/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update the user in context
            login(data);
            showToast('Profile updated successfully!', 'success');

            // Navigate back to profile
            if (user.role === 'coach') {
                navigate('/dashboard');
            } else {
                navigate(`/athlete/${user._id}`);
            }

        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg transition-colors duration-300">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Edit Your Profile
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* District */}
                    <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            District
                        </label>
                        <input
                            id="district"
                            name="district"
                            type="text"
                            required
                            className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="District"
                            value={formData.district}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Athlete-specific fields */}
                    {user.role === 'athlete' && (
                        <>
                            <div>
                                <label htmlFor="sport" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Sport
                                </label>
                                <select
                                    id="sport"
                                    name="sport"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={formData.sport}
                                    onChange={handleChange}
                                >
                                    {SPORTS_LIST.map((sport) => (
                                        <option key={sport} value={sport} disabled={sport === "Select a Sport"}>
                                            {sport}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                    Age
                                </label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    required
                                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    {/* Coach-specific fields */}
                    {user.role === 'coach' && (
                        <div>
                            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                                Team/Affiliation
                            </label>
                            <input
                                id="team"
                                name="team"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Team"
                                value={formData.team}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
