import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../server/instance'; // axios me interceptors

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ruan info user
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Funksioni per me marre user aktual (me token)
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setLoading(false);
      navigate('/login/signin');  // ridrejto ne login nese s'ka user
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      // supozon qe tokeni vendoset ne cookie nga backend
      await fetchUser();
      navigate('/'); // ose path sipas roli
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/login/signin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
