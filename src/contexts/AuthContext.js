import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE_URL from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        return { success: true };
      } else {
        setError(data.message || 'Email ou senha incorretos');
        return { success: false, message: data.message || 'Email ou senha incorretos' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = 'Erro ao conectar com o servidor. Verifique sua conexão.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        return { success: true };
      } else {
        setError(data.message || 'Erro ao registrar usuário');
        return { success: false, message: data.message || 'Erro ao registrar usuário' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      const errorMessage = 'Erro ao conectar com o servidor. Verifique sua conexão.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfile = async (updatedUser) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true };
      } else {
        setError(data.message || 'Erro ao atualizar perfil');
        return { success: false, message: data.message || 'Erro ao atualizar perfil' };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = 'Erro ao conectar com o servidor.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAdmin = () => {
    return user?.is_admin === true || user?.is_admin === 1;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      updateProfile, 
      isLoading,
      error,
      clearError,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
