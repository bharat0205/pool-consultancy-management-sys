import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Make sure Link is imported

function AdminDashboard() {
  // All state variables for all features (no changes here)
  const [consultants, setConsultants] = useState([]);
  const [newConsultant, setNewConsultant] = useState({ name: '', email: '', skills: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // --- All Functions for All Features ---

  // Fetches the full list of consultants for the main table
  const fetchConsultants = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/consultants');
      setConsultants(response.data);
    } catch (error) {
      console.error("There was an error fetching the consultants:", error);
    }
  };

  // Handles text input changes for the "Add Consultant" form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsultant({ ...newConsultant, [name]: value });
  };

  // Handles file selection for the "Add Consultant" form
  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  // Handles submitting the "Add Consultant" form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      alert("Please select a resume file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('name', newConsultant.name);
    formData.append('email', newConsultant.email);
    formData.append('skills', newConsultant.skills);
    formData.append('resume', resumeFile);

    try {
      await axios.post('http://127.0.0.1:5000/api/consultants', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchConsultants(); // Refresh the main table
      setNewConsultant({ name: '', email: '', skills: '' });
      setResumeFile(null);
      e.target.reset();
    } catch (error) {
      console.error("Error adding consultant:", error);
    }
  };

  // Handles submitting the AI search query
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/search', { query: searchQuery });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error during AI search:", error);
      alert("Search failed. Please check the console for details.");
    }
    setIsSearching(false);
  };
  
  // --- NEW: FUNCTION TO HANDLE DELETION ---
  const handleDelete = async (consultantId) => {
    // Confirm with the user before deleting
    if (window.confirm('Are you sure you want to delete this consultant? This action cannot be undone.')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/api/consultants/${consultantId}`);
        // After success, refresh the consultant list to update the table
        fetchConsultants();
        alert('Consultant deleted successfully.');
      } catch (error) {
        console.error("Error deleting consultant:", error);
        alert("Failed to delete consultant. Please try again.");
      }
    }
  };

  // Runs once on page load to get the initial consultant list
  useEffect(() => {
    fetchConsultants();
  }, []);

  // --- Styling Objects (no change) ---
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
  const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2', fontWeight: 'bold' };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage consultants and find the best candidates using the AI Resume Matcher.</p>

      {/* --- SECTION 1: Add a New Consultant Form (Unchanged) --- */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h2>Add a New Consultant</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}><label>Name: </label><input type="text" name="name" value={newConsultant.name} onChange={handleInputChange} required style={{ width: '300px', padding: '5px' }} /></div>
          <div style={{ marginBottom: '10px' }}><label>Email: </label><input type="email" name="email" value={newConsultant.email} onChange={handleInputChange} required style={{ width: '300px', padding: '5px' }} /></div>
          <div style={{ marginBottom: '10px' }}><label>Skills: </label><input type="text" name="skills" value={newConsultant.skills} onChange={handleInputChange} required style={{ width: '300px', padding: '5px' }} /></div>
          <div style={{ marginBottom: '10px' }}><label>Resume (PDF): </label><input type="file" name="resume" onChange={handleFileChange} accept=".pdf" required /></div>
          <button type="submit" style={{ padding: '10px 20px' }}>Add Consultant</button>
        </form>
      </div>

      {/* --- SECTION 2: AI Resume Matcher (Unchanged) --- */}
      <div style={{ border: '1px solid #007bff', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h2>AI Resume Matcher</h2>
        <form onSubmit={handleSearch}>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="e.g., Senior Java developer with Spring Boot" required style={{ width: '500px', padding: '10px' }}/>
          <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }} disabled={isSearching}>{isSearching ? 'Searching...' : 'Find Best Match'}</button>
        </form>
        {searchResults.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>Search Results (Best match first):</h3>
            {searchResults.map((result) => (
              <div key={result.consultant.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                <h4>{result.consultant.name} (Match Score: {result.score})</h4>
                <p><strong>Skills:</strong> {result.consultant.skills}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- SECTION 3: All Consultants Table (Now with Edit and Delete buttons) --- */}
      <h2>All Consultants</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Skills</th>
            <th style={thStyle}>Resume Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {consultants.map(consultant => (
            <tr key={consultant.id}>
              <td style={thTdStyle}>{consultant.id}</td>
              <td style={thTdStyle}>{consultant.name}</td>
              <td style={thTdStyle}>{consultant.skills}</td>
              <td style={thTdStyle}>{consultant.resume_status}</td>
              <td style={thTdStyle}>
                <Link to={`/update/${consultant.id}`}>
                  <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>
                    Edit
                  </button>
                </Link>
                <button onClick={() => handleDelete(consultant.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
