import React from 'react'
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <>
     <nav style={{ backgroundColor: '#333', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
    <div>
      <h1 style={{ height: '40px', marginRight: '20px' }}>Expense Tracker</h1>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>Home</Link>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>About Us</Link>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', marginRight: '20px' }}>Products</Link>
      
    </div>
    <div>
      <Link to="/signup" style={{ color: '#fff', textDecoration: 'none' }}>Sign Up</Link>
    </div>
  </nav>
  <div>
    <h2>Home Page</h2>
  </div>
    </>

  )
}

export default Home