import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <nav style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>Expense Tracker</h1>
        <div>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px', padding: '8px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>Home</Link>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px', padding: '8px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>About Us</Link>
          <Link to="/expenses" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px', padding: '8px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>Expenses</Link>
          <Link to="/signup" style={{ color: '#fff', textDecoration: 'none', margin: '0 10px', padding: '8px', borderRadius: '5px', transition: 'background-color 0.3s ease', backgroundColor: '#007bff' }}>Sign Up/Login</Link>
        </div>
      </nav>

      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Welcome to Expense Tracker</h2>
        <p>A simple tool to manage your expenses efficiently.</p>
        <Link to="/expenses" style={{ textDecoration: 'none', color: 'blue', fontSize: '18px', marginTop: '20px', display: 'block' }}>View Your Expenses</Link>
      </div>
    </>
  );
};

export default Home;
