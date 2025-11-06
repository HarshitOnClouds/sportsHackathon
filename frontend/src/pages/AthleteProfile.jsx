import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Import Chart.js components
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// This is the "WOW" page
function AthleteProfile() {
    const { id } = useParams(); // Get the athlete's ID from the URL
    const { user } = useAuth();
    const { showToast } = useToast();

    const [athlete, setAthlete] = useState(null);
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the chart data
    const [chartData, setChartData] = useState(null);

    // State for the performance form
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        metricName: '',
        metricValue: '',
        metricUnit: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- 1. Get Athlete's Profile Info ---
                const profileRes = await axios.get(`http://localhost:3001/api/users/${id}`);
                setAthlete(profileRes.data);

                // --- 2. Get Athlete's Performance History ---
                const performanceRes = await axios.get(`http://localhost:3001/api/performance/${id}`);
                setPerformances(performanceRes.data);

                // --- 3. Process data for the chart ---
                if (performanceRes.data && performanceRes.data.length > 0) {
                    // Assuming all metrics are the same for this athlete for simplicity
                    // In a real app, you'd let the user select which metric to chart
                    const metricName = performanceRes.data[0].metricName;

                    const labels = performanceRes.data.map(p => new Date(p.date).toLocaleDateString());
                    const data = performanceRes.data.map(p => p.metricValue);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: `${metricName} (${performanceRes.data[0].metricUnit})`,
                                data: data,
                                fill: false,
                                borderColor: 'rgb(59, 130, 246)', // Blue
                                tension: 0.1,
                            },
                        ],
                    });
                }

            } catch (err) {
                setError('Failed to fetch athlete data');
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [id]); // Re-run if the ID in the URL changes

    // Handle form input changes
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        try {
            const response = await axios.post('http://localhost:3001/api/performance', {
                athleteId: id,
                ...formData,
                metricValue: Number(formData.metricValue)
            });

            setFormSuccess('Performance logged successfully!');
            showToast('Performance logged successfully!', 'success');
            setShowForm(false);
            
            // Reset form
            setFormData({
                metricName: '',
                metricValue: '',
                metricUnit: '',
                date: new Date().toISOString().split('T')[0],
                notes: ''
            });

            // Refresh performances
            const performanceRes = await axios.get(`http://localhost:3001/api/performance/${id}`);
            setPerformances(performanceRes.data);

            // Update chart
            if (performanceRes.data && performanceRes.data.length > 0) {
                const metricName = performanceRes.data[0].metricName;
                const labels = performanceRes.data.map(p => new Date(p.date).toLocaleDateString());
                const data = performanceRes.data.map(p => p.metricValue);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: `${metricName} (${performanceRes.data[0].metricUnit})`,
                            data: data,
                            fill: false,
                            borderColor: 'rgb(59, 130, 246)',
                            tension: 0.1,
                        },
                    ],
                });
            }

            setTimeout(() => setFormSuccess(null), 3000);
        } catch (err) {
            setFormError('Failed to log performance. Please try again.');
            showToast('Failed to log performance', 'error');
            console.error(err);
        }
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#E5E7EB' // White/Gray text
                }
            },
            title: {
                display: true,
                text: 'Performance Over Time',
                color: '#E5E7EB'
            },
        },
        scales: {
            x: {
                ticks: { color: '#9CA3AF' }, // Gray text
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: '#9CA3AF' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };


    if (loading) return <LoadingSpinner />;
    if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">{error}</div>;
    if (!athlete) return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative text-center">Athlete not found.</div>;

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            {/* --- Athlete Header --- */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-green-400">{athlete.name}</h1>
                <p className="text-xl text-gray-300">{athlete.sport} | Age: {athlete.age} | {athlete.district}</p>
            </div>

            {/* --- THE "WOW" GRAPH --- */}
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
                {chartData ? (
                    <Line options={chartOptions} data={chartData} />
                ) : (
                    <p className="text-center text-gray-400">No performance data recorded yet to display a chart.</p>
                )}
            </div>

            {/* --- Raw Performance Log --- */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Performance Log</h2>
                <div className="space-y-2">
                    {performances.length > 0 ? (
                        performances.map(p => (
                            <div key={p._id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <span className="font-semibold text-blue-400">{p.metricName}: </span>
                                    <span className="text-xl font-bold">{p.metricValue} {p.metricUnit}</span>
                                    {p.notes && <p className="text-sm text-gray-400">{p.notes}</p>}
                                </div>
                                <span className="text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No performance records found.</p>
                    )}
                </div>
            </div>

            {/* Performance Logging Form - Only show to the athlete owner */}
            {user && user._id === id && (
                <div className="mt-8">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mb-4"
                    >
                        {showForm ? 'Hide Form' : 'Log New Performance'}
                    </button>

                    {showForm && (
                        <div className="bg-gray-700 p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4 text-blue-400">Add Performance Record</h3>
                            
                            {formError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                                    {formError}
                                </div>
                            )}
                            
                            {formSuccess && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                    {formSuccess}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Metric Name (e.g., 100m Sprint)
                                    </label>
                                    <input
                                        type="text"
                                        name="metricName"
                                        value={formData.metricName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Value
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="metricValue"
                                            value={formData.metricValue}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Unit (e.g., seconds, meters)
                                        </label>
                                        <input
                                            type="text"
                                            name="metricUnit"
                                            value={formData.metricUnit}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Submit Performance
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}

export default AthleteProfile;