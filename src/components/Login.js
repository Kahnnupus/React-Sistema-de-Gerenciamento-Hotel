import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/");
    } else {
      setError("Email ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-800 dark:text-purple-200 mb-6">
          Login
        </h2>
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-purple-700 dark:text-purple-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-purple-700 dark:text-purple-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Entrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-purple-700 dark:text-purple-300">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
              Registrar-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
