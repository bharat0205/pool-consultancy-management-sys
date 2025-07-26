import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ConsultantDashboard from './pages/ConsultantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    // The Router must be the top-level component
    <Router>
      <div>
        <Navbar />
        <main style={{ padding: '20px' }}>
          <Routes>
            {/* Your page routes go here */}
            <Route path="/" element={<ConsultantDashboard />} />
            <Route path="/consultant" element={<ConsultantDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
