import React, { useRef, useState } from 'react';
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../Store/auth';


const Signup = () => {
  const history = useNavigate();
  const emailInputRef = useRef()
  const passwordInputRef = useRef();
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.auth.isLoggedIn);

  const [isLogin, setIsLogin] = useState(loggedIn);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState)
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    let url;
    if(isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDv0l7lFr3WIeezPmxlmlpxrkYc1S-Q8rM'
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDv0l7lFr3WIeezPmxlmlpxrkYc1S-Q8rM'
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then((res) => {
    setIsLoading(false);
    if(res.ok) {
      return res.json();
    } else {
      return res.json().then((data) => {
        let errorMessage = 'Authentication failed';
        if(data && data.error && data.error.message) {
          errorMessage = data.error.message
        }
        throw new Error(errorMessage)
      })
    }
  })
  .then((data) => {
    dispatch(authActions.login({ token: data.idToken, email: data.email }))
    {isLogin ? history('/profile') : history('/')}
  })
  .catch((err) => {
    alert(err.message)
  })
  };
    
  return (
    <div>
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
     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <form onSubmit={submitHandler}>
          <h2>{isLogin ? 'Login' : 'Signup'}</h2>
          <label htmlFor='email'>Email</label>
            <input type="email" id='email' required ref={emailInputRef} />
          <br />
          <label htmlFor='password'>Password</label>
            <input type="password" id='password' required ref={passwordInputRef} />
          <br />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Link to="/forgotpassword" style={{ color: '#333', textDecoration: 'none', marginRight: '20px' }}>Forgot Password</Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Signup'}</button>}
          {isLoading && <p>Loading...</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
           <button type='button'onClick={switchAuthModeHandler}>{isLogin ? 'Create new account'  : 'Have an account? Login'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup