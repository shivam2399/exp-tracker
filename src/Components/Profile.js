import React from 'react'
import './Profile.css';
import { Link } from 'react-router-dom';


const Profile = () => {
  return (
    <div className="profile-container">
     <h2>Welcome to Expense Tracker</h2>
     <p>Your profile is incomplete. <Link to ='/userdetails'>Complete now</Link></p>
    </div>
  )
}

export default Profile;