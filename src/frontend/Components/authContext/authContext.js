import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  

  const storedUser = localStorage.getItem('user');
  const initialUser = storedUser
    ? { ...JSON.parse(storedUser), isLoggedIn: true }
    : { isLoggedIn: false, isAdmin: false };

  const [user, setUser] = useState(initialUser);
  


  const toggleLogin = () => {
    setUser((prevUser) => ({
      ...prevUser,
      isLoggedIn: !prevUser.isLoggedIn
    }));
  };

  const contextValue = { user, toggleLogin ,setUser};
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
