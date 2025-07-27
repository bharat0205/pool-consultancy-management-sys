import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateConsultant() {
  const { id } = useParams(); // Gets the ID from the URL (e.g., /update/5)
  const navigate = useNavigate(); // To redirect the user after a successful update

  const [consultant, setConsultant] = useState({ name: '', email: '', skills: '' });

  // This runs when the page loads to get the current consultant's details
  useEffect(() => {
    const fetchConsultantDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/consultant/${id}`);
        setConsultant(response.data);
      } catch (error) {
        console.error("Error fetching consultant details:", error);
      }
    };
    fetchConsultantDetails();
  }, [id]);

  // Updates the form fields as the user types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConsultant({ ...consultant, [name]: value });
  };

  // Submits the updated data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/api/consultants/${id}`, consultant);
      alert('Consultant updated successfully!');
      navigate('/admin'); // Go back to the main admin dashboard
    } catch (error) {
      console.error("Error updating consultant:", error);
      alert('Failed to update consultant.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Edit Consultant Details</h1>
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text" name="name" value={consultant.name}
            onChange={handleInputChange} required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email" name="email" value={consultant.email}
            onChange={handleInputChange} required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Skills:</label>
          <input
            type="text" name="skills" value={consultant.skills}
            onChange={handleInputChange} required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', width: '100%', fontSize: '16px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Update Consultant
        </button>
      </form>
    </div>
  );
}

export default UpdateConsultant;
