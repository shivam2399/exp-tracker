import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  email: "",
  login: (token, email) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const initialEmail = localStorage.getItem("email");

  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState(initialEmail);
  const [logoutTimeout, setLogoutTimeout] = useState(null);

  

  const userIsLoggedIn = !!token;

  const loginHandler = (token, email) => {
    setToken(token);
    setEmail(email);
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    const timeout = setTimeout(logoutHandler, 5 * 60 * 1000);
    setLogoutTimeout(timeout);
  };

  const logoutHandler = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem("token"); 
    localStorage.removeItem("email"); 
    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
      setLogoutTimeout(null);
    }
  };

  useEffect(() => {
    if(token && !logoutTimeout) {
      const timeout = setTimeout(logoutHandler, 5*60*1000);
      setLogoutTimeout(timeout)
    }
  }, [token, logoutTimeout])

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    email: email,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;