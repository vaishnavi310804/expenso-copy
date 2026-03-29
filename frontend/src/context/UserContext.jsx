import React, { createContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ fullName: '', email: '' });
  const [menu, setMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingContext, setLoadingContext] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser({ fullName: res.data.name, email: res.data.email, ...res.data });
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth check error:", error);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      setLoadingContext(false);
    };
    fetchUser();
  }, []);

  const requriedValue = {
    user, setUser, theme, setTheme,
    isAuthenticated, setIsAuthenticated,
    menu, setMenu, showPassword, setShowPassword
  };

  return (
    <UserContext.Provider value={requriedValue}>
      {!loadingContext && children}
    </UserContext.Provider>
  );
};


