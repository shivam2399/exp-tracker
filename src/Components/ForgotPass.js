import React, { useRef, useState } from 'react';
import './ForgotPass.css';

const ForgotPass = () => {
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = () => {
    const enteredEmail = emailRef.current.value;
    setIsLoading(true);

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDv0l7lFr3WIeezPmxlmlpxrkYc1S-Q8rM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: enteredEmail,
        requestType: 'PASSWORD_RESET',
      }),
    })
      .then((response) => {
        setIsLoading(false);
        if (!response.ok) {
          throw new Error('Failed to reset password');
        }
        return response.json();
      })
      .then((data) => {
        if (data.error && data.error.message === 'EMAIL_NOT_FOUND') {
          setErrorMessage('Email address not found. Please enter a valid email.');
          setSuccessMessage('');
        } else {
          setSuccessMessage('Password reset email sent successfully.');
          setErrorMessage('');
          emailRef.current.value = '';
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error resetting password:', error);
        setErrorMessage('Failed to reset password. Please try again.');
        setSuccessMessage('');
      });
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="forgot-password-form">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" ref={emailRef} required />
        <button onClick={handleResetPassword} disabled={isLoading}>
          {isLoading ? <div className="loader"></div> : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPass;
