import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Sun, Moon, UserPlus, User, Mail, Phone, MapPin, Lock } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateTelefone = (telefone) =>
    /^\(\d{2}\)\s\d{5}-\d{4}$/.test(telefone);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits.length === 0 ? "" : `(${digits}`;
    else if (digits.length <= 6)
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    else if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    else
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = name === "telefone" ? formatPhone(value) : value;
    setFormData({ ...formData, [name]: formattedValue });
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const newFieldErrors = {};

    if (!validateEmail(formData.email)) newFieldErrors.email = "Email inválido";
    if (!validateTelefone(formData.telefone))
      newFieldErrors.telefone =
        "Telefone deve estar no formato (XX) XXXXX-XXXX";

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    const userData = {
      nome: formData.nome,
      email: formData.email,
      telefone: formData.telefone,
      endereco: formData.endereco,
      password: formData.password,
      foto: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    };

    const result = await register(userData);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || "Email já cadastrado");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 dark:bg-gray-900 relative py-8">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded-md transition-colors font-medium ${theme === "dark"
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-purple-200 text-purple-800 hover:bg-purple-300"
            }`}
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-purple-800 dark:text-purple-200 mb-6">
          Registrar-se
        </h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
              <User className="w-4 h-4" />
              Nome
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
            {fieldErrors.telefone && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.telefone}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Endereço
            </label>
            <textarea
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              rows="3"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Registrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-purple-700 dark:text-purple-300">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
