import React, { useRef, useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import AuthContext from "../Store/auth-context";

const UserDetails = () => {
  const nameRef = useRef();
  const photoRef = useRef();

  const authCntx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({name: '', photoUrl: ''});

  const getUserData = () => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      alert("No idToken found in localStorage");
      return;
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDv0l7lFr3WIeezPmxlmlpxrkYc1S-Q8rM&idToken=${idToken}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Authentication failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        var name = data.users[0].displayName;
        var photo = data.users[0].photoUrl;
        console.log(name, photo);
        setUserData({name, photoUrl: photo})
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Fetch error: " + err.message);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredName = nameRef.current.value;
    const enteredPhoto = photoRef.current.value;
    setIsLoading(true);
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDv0l7lFr3WIeezPmxlmlpxrkYc1S-Q8rM";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCntx.token,
        displayName: enteredName,
        photoUrl: enteredPhoto,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        localStorage.setItem("name", data.displayName);
        localStorage.setItem("photoURL", data.photoUrl);
        nameRef.current.value = "";
        photoRef.current.value = "";
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleNameChange = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      name: e.target.value,
    }));
  };

  const handlePhotoUrlChange = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      photoUrl: e.target.value,
    }));
  };

  return (
    <>
      <h3>Winners never quit</h3>
      <div>
        <h2>Contact Details</h2>
        <form onSubmit={submitHandler}>
          <div className="icon-input">
            <FontAwesomeIcon icon={faGithub} />
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              required
              ref={nameRef}
              placeholder={
                userData.name ? userData.name : "Enter Full Name"
              }
              value={userData.name}
              onChange={handleNameChange}
            />
          </div>
          <div className="icon-input">
            <FontAwesomeIcon icon={faGlobe} />
            <label htmlFor="photoUrl">Profile Photo URL</label>
            <input
              type="text"
              id="photoUrl"
              required
              ref={photoRef}
              placeholder={
                userData.photoUrl ? userData.photoUrl : "Enter profile picture URL"
              }
              value={userData.photoUrl}
              onChange={handlePhotoUrlChange}
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