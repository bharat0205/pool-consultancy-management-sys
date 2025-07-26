import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const navStyle = {
    display: 'flex',
    gap: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
  };

  return (
    <nav style={navStyle}>
      <Link to="/consultant">Consultant View</Link>
      <Link to="/admin">Admin View</Link>
    </nav>
  );
}

export default Navbar;
