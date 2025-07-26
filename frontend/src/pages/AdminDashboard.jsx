import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [consultants, setConsultants] = useState([]);
  // --- NEW CODE STARTS HERE ---
  // Create state variables to hold the data from our new form fields
  const [newConsultant, setNewConsultant] = useState({
    name: '',
    email: '',
    skills: ''
  });

  // This function will fetch consultants. We'll call it to refresh the list.
  const fetchConsultants = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/consultants');
      setConsultants(response.data);
    } catch (error) {
      console.error("There was an error fetching the consultants:", error);
    }
  };

  // This function updates our state variables as the user types in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsultant({ ...newConsultant, [name]: value });
  };

  // This function runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser from reloading the page
    try {
      // Send the new consultant data to our backend's POST endpoint
      await axios.post('http://127.0.0.1:5000/api/consultants', newConsultant);
      // After a successful submission, fetch the updated list of consultants
      fetchConsultants();
      // Clear the form fields
      setNewConsultant({ name: '', email: '', skills: '' });
    } catch (error) {
      console.error("Error adding consultant:", error);
    }
  };
  // --- NEW CODE ENDS HERE ---

  useEffect(() => {
    fetchConsultants(); // Fetch the initial list when the page loads
  }, []);

  // Styling (no changes here)
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '20px' };
  const thTdStyle = { border: '1px solid #ddd', padding: '8px', textAlign: 'left' };
  const thStyle = { ...thTdStyle, backgroundColor: '#f2f2f2', fontWeight: 'bold' };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Here you can view and manage all consultants.</p>

      {/* --- NEW FORM STARTS HERE --- */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
        <h2>Add a New Consultant</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={newConsultant.name}
              onChange={handleInputChange}
              required
              style={{ width: '300px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={newConsultant.email}
              onChange={handleInputChange}
              required
              style={{ width: '300px', padding: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Skills: </label>
            <input
              type="text"
              name="skills"
              value={newConsultant.skills}
              onChange={handleInputChange}
              required
              style={{ width: '300px', padding: '5px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px' }}>Add Consultant</button>
        </form>
      </div>
      {/* --- NEW FORM ENDS HERE --- */}

      {/* The table of consultants remains the same */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Skills</th>
            <th style={thStyle}>Resume Status</th>
          </tr>
        </thead>
        <tbody>
          {consultants.map(consultant => (
            <tr key={consultant.id}>
              <td style={thTdStyle}>{consultant.id}</td>
              <td style={thTdStyle}>{consultant.name}</td>
              <td style={thTdStyle}>{consultant.skills}</td>
              <td style={thTdStyle}>{consultant.resume_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
