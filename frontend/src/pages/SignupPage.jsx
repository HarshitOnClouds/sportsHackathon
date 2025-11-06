import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SignupPage = () => {
    const { login } = useAuth();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'athlete', // default role
        sport: '',
        district: '',
        age: '',
        team: ''
    });

    const [role, setRole] = useState('athlete');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: newRole,
            sport: '',
            district: '',
            age: '',
            team: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccess('Profile created successfully! Redirecting...');
            showToast('Profile created successfully!', 'success');
            console.log('Form data submitted:', data);

            // Log in the user automatically
            login(data);

            // Redirect after a short delay
            setTimeout(() => {
                if (formData.role === 'coach') {
                    navigate('/dashboard');
                } else {
                    navigate(`/athlete/${data._id}`);
                }
            }, 1500);

        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
            console.error('Failed to submit form:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg transition-colors duration-300">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                </div>

                {error && <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">{error}</div>}
                {success && <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative" role="alert">{success}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength="6"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength="6"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {/* District */}
                        <div className="mb-4">
                            <label htmlFor="district" className="sr-only">District</label>
                            <input
                                id="district"
                                name="district"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="District"
                                value={formData.district}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Role */}
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                            <select
                                id="role"
                                name="role"
                                value={role}
                                onChange={handleRoleChange}
                                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="athlete">Athlete</option>
                                <option value="coach">Coach</option>
                            </select>
                        </div>

                        {/* Conditional Fields */}
                        {role === 'athlete' && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="sport" className="sr-only">Sport</label>
                                    <input
                                        id="sport"
                                        name="sport"
                                        type="text"
                                        required={role === 'athlete'}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Sport (e.g., Athletics, Swimming)"
                                        value={formData.sport}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="age" className="sr-only">Age</label>
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        required={role === 'athlete'}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Age"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {role === 'coach' && (
                            <div className="mb-4">
                                <label htmlFor="team" className="sr-only">Team/Affiliation</label>
                                <input
                                    id="team"
                                    name="team"
                                    type="text"
                                    required={role === 'coach'}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Team or Affiliation"
                                    value={formData.team}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
