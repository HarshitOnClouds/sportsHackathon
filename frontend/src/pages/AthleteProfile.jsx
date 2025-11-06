import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

    const [athlete, setAthlete] = useState(null);
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the chart data
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // --- 1. Get Athlete's Profile Info ---
                const profileRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
                setAthlete(profileRes.data);

                // --- 2. Get Athlete's Performance History ---
                const performanceRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/performance/${id}`);
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


    if (loading) return <p className="text-center text-blue-400">Loading Athlete Analytics...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!athlete) return <p className="text-center text-gray-400">Athlete not found.</p>;

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

            {/* TODO: Add a form here for an athlete to log NEW performance data */}

        </div>
    );
}

export default AthleteProfile;