import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = (updatedUser) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      localStorage.setItem("users", JSON.stringify(users));
      setUser(users[userIndex]);
      localStorage.setItem("user", JSON.stringify(users[userIndex]));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
