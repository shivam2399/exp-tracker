import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const [logoutTimeout, setLogoutTimeout] = useState(null);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    const timeout = setTimeout(logoutHandler, 5 * 60 * 1000);
    setLogoutTimeout(timeout);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
      setLogoutTimeout(null);
    }
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
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