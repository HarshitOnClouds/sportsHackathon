import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { METRIC_LIST } from '../constants/sportsConstants';

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

    // State for statistics
    const [stats, setStats] = useState(null);

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
                const performanceRes = await axios.get(`http://localhost:3001/api/performance/athlete/${id}`);
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

                    // Calculate statistics
                    calculateStats(performanceRes.data);
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

    // Calculate statistics
    const calculateStats = (performanceData) => {
        if (!performanceData || performanceData.length === 0) {
            setStats(null);
            return;
        }

        const values = performanceData.map(p => p.metricValue);
        const total = values.reduce((sum, val) => sum + val, 0);
        const average = total / values.length;
        const best = Math.max(...values);
        const worst = Math.min(...values);

        // Calculate improvement (last vs first)
        const first = values[0];
        const last = values[values.length - 1];
        const improvement = ((last - first) / first * 100).toFixed(2);

        setStats({
            average: average.toFixed(2),
            best,
            worst,
            total: values.length,
            improvement: improvement > 0 ? `+${improvement}%` : `${improvement}%`,
            improvementPositive: improvement > 0
        });
    };

    // Handle export to CSV
    const handleExportCSV = () => {
        if (performances.length === 0) {
            showToast('No performance data to export', 'warning');
            return;
        }

        // Prepare CSV content
        const headers = ['Date', 'Metric Name', 'Value', 'Unit', 'Notes'];
        const rows = performances.map(p => [
            new Date(p.date).toLocaleDateString(),
            p.metricName,
            p.metricValue,
            p.metricUnit,
            p.notes || ''
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${athlete.name}_performance_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Performance data exported successfully!', 'success');
    };

    // Handle delete performance
    const handleDeletePerformance = async (performanceId) => {
        if (!window.confirm('Are you sure you want to delete this performance record?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3001/api/performance/${performanceId}`);
            showToast('Performance record deleted successfully!', 'success');

            // Refresh performances
            const performanceRes = await axios.get(`http://localhost:3001/api/performance/athlete/${id}`);
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
                calculateStats(performanceRes.data);
            } else {
                // No performances left, clear the chart
                setChartData(null);
                setStats(null);
            }
        } catch (err) {
            showToast('Failed to delete performance record', 'error');
            console.error(err);
        }
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        // Validate metric selection
        if (!formData.metricName || formData.metricName === 'Select a Metric') {
            setFormError('Please select a metric');
            showToast('Please select a metric', 'error');
            return;
        }

        // Validate unit selection
        if (!formData.metricUnit || formData.metricUnit === 'Select Unit') {
            setFormError('Please select a unit');
            showToast('Please select a unit', 'error');
            return;
        }

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
            const performanceRes = await axios.get(`http://localhost:3001/api/performance/athlete/${id}`);
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
                calculateStats(performanceRes.data);
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
    if (error) return <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative text-center">{error}</div>;
    if (!athlete) return <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded relative text-center">Athlete not found.</div>;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl transition-colors duration-300">
            {/* --- Athlete Header --- */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">{athlete.name}</h1>
                <p className="text-xl text-gray-700 dark:text-gray-300">{athlete.sport} | Age: {athlete.age} | {athlete.district}</p>
            </div>

            {/* --- PERFORMANCE STATISTICS --- */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-blue-600 p-4 rounded-lg text-center">
                        <p className="text-sm text-blue-200">Total Records</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-green-600 p-4 rounded-lg text-center">
                        <p className="text-sm text-green-200">Average</p>
                        <p className="text-2xl font-bold">{stats.average}</p>
                    </div>
                    <div className="bg-yellow-600 p-4 rounded-lg text-center">
                        <p className="text-sm text-yellow-200">Best</p>
                        <p className="text-2xl font-bold">{stats.best}</p>
                    </div>
                    <div className="bg-red-600 p-4 rounded-lg text-center">
                        <p className="text-sm text-red-200">Worst</p>
                        <p className="text-2xl font-bold">{stats.worst}</p>
                    </div>
                    <div className={`${stats.improvementPositive ? 'bg-emerald-600' : 'bg-orange-600'} p-4 rounded-lg text-center`}>
                        <p className="text-sm text-white opacity-80">Improvement</p>
                        <p className="text-2xl font-bold">{stats.improvement}</p>
                    </div>
                </div>
            )}

            {/* --- THE "WOW" GRAPH --- */}
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 transition-colors duration-300">
                {chartData ? (
                    <Line options={chartOptions} data={chartData} />
                ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">No performance data recorded yet to display a chart.</p>
                )}
            </div>

            {/* --- Raw Performance Log --- */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Performance Log</h2>
                    {performances.length > 0 && (
                        <button
                            onClick={handleExportCSV}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Export CSV
                        </button>
                    )}
                </div>
                <div className="space-y-2">
                    {performances.length > 0 ? (
                        performances.map(p => (
                            <div key={p._id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center transition-colors duration-300">
                                <div className="flex-1">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">{p.metricName}: </span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{p.metricValue} {p.metricUnit}</span>
                                    {p.notes && <p className="text-sm text-gray-600 dark:text-gray-400">{p.notes}</p>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(p.date).toLocaleDateString()}</span>
                                    {user && user._id === id && (
                                        <button
                                            onClick={() => handleDeletePerformance(p._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
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
                        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
                            <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">Add Performance Record</h3>
                            
                            {formError && (
                                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-4">
                                    {formError}
                                </div>
                            )}
                            
                            {formSuccess && (
                                <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-4">
                                    {formSuccess}
                                </div>
                            )}

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Metric Name
                                    </label>
                                    <select
                                        name="metricName"
                                        value={formData.metricName}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select a Metric</option>
                                        {METRIC_LIST.map((metric) => (
                                            <option key={metric} value={metric}>
                                                {metric}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Value
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="metricValue"
                                            value={formData.metricValue}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Unit
                                        </label>
                                        <select
                                            name="metricUnit"
                                            value={formData.metricUnit}
                                            onChange={handleFormChange}
                                            required
                                            className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Unit</option>
                                            <option value="seconds">seconds</option>
                                            <option value="minutes">minutes</option>
                                            <option value="meters">meters</option>
                                            <option value="cm">cm</option>
                                            <option value="kg">kg</option>
                                            <option value="reps">reps</option>
                                            <option value="points">points</option>
                                            <option value="count">count</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleFormChange}
                                        required
                                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Notes (optional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="w-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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