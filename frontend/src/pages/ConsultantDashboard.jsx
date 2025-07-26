import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConsultantDashboard() {
  const [consultants, setConsultants] = useState([]);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/consultants');
        setConsultants(response.data);
      } catch (error) {
        console.error("There was an error fetching the consultants:", error);
      }
    };

    fetchConsultants();
  }, []);

  return (
    <div>
      <h1>Consultant Dashboard</h1>
      <p>Welcome! Here is the current list of consultants.</p>

      <div style={{ marginTop: '20px' }}>
        {consultants.map(consultant => (
          <div key={consultant.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <h2>{consultant.name}</h2>
            <p><strong>Skills:</strong> {consultant.skills}</p>
            <p><strong>Resume Status:</strong> {consultant.resume_status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsultantDashboard;
