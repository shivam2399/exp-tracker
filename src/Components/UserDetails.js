import React, { useRef, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import AuthContext from '../Store/auth-context';

const UserDetails = () => {
  const nameRef = useRef();
  const photoRef = useRef();

  const authCntx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredName = nameRef.current.value
    const enteredPhoto = photoRef.current.value
    setIsLoading(true)
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDv0l7lFr3WIeezPmxlmlpxrkYc1S-Q8rM';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCntx.token,
        displayName: enteredName,
        photoURL: enteredPhoto,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then((res) => {
    setIsLoading(false)
    if(res.ok) {
      return res.json()
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
    localStorage.setItem('name', data.displayName)
    localStorage.setItem('photoURL', data.photoUrl)
  })
  .catch((err) => {
    alert(err.message);
  })
  };

  return (
    <>
      <h3>Winners never quit</h3>
      <div>
        <h3>Contact Details</h3>
        <form onSubmit={submitHandler}>
        <div className="icon-input">
          <FontAwesomeIcon icon={faGithub} />
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id='name'
            required ref={nameRef}
            placeholder="Enter Full Name"
          />
        </div>
        <div className="icon-input">
          <FontAwesomeIcon icon={faGlobe} />
          <label htmlFor="photourl">Profile Photo URL</label>
          <input
            type="url"
            id='photourl'
            required ref = {photoRef}
            placeholder="Enter profile picture URL"
          />
        </div>
        <br></br>
        <button>Update</button>
        {isLoading && <p>Loading...</p>}
        </form>
        
        </div>
    </>
  );
};

export default UserDetails;