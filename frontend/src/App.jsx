import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignupPage from './pages/SignupPage';
import Navbar from './pages/Navbar';
import HomePage from './pages/HomePage';
import CoachDashboard from './pages/CoachDashboard';
import AthleteProfile from './pages/AthleteProfile';

// We'll create these component files next
// import HomePage from './pages/HomePage';
// import CoachDashboard from './pages/CoachDashboard';
// import AthleteProfile from './pages/AthleteProfile';

function App() {
  return (
    <div className="min-h-screen container mx-auto p-4">
      
      {/* TODO: Add a Navbar component here */}
      <Navbar />
      <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">
        UK-TalentScout
      </h1>

      {/* --- Define Your App's Pages --- */}
      <Routes>
<Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<CoachDashboard />} />
        <Route path="/athlete/:id" element={<AthleteProfile />} />

        {/* Placeholder for now */}
        {/* <Route path="/" element={
          <div>
            <h2 className="text-2xl text-center">Welcome!</h2>
            <p className="text-center">Our components will go here.</p>
          </div>
        } /> */}
      </Routes>
    </div>
  );
}

export default App;