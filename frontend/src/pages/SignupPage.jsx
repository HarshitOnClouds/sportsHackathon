import React, { useState } from 'react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'athlete', // default role
        sport: '',
        district: '',
        age: '',
        team: ''
    });

    const [role, setRole] = useState('athlete');

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        setRole(newRole);
        setFormData({
            ...formData,
            role: newRole,
            // Clear fields that are not relevant for the new role
            sport: '',
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here, e.g., send data to the backend
        console.log('Form data submitted:', formData);
        // You would typically make an API call here
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
