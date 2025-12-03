import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const Configuracoes = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="animacao-fade-in max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Configurações
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
          Preferências de Tema
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-purple-700 dark:text-purple-300 font-medium">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              theme === "dark" ? "bg-purple-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p className="text-sm text-purple-500 dark:text-purple-400 mt-2">
          Ative o modo escuro para uma experiência visual mais confortável em
          ambientes com pouca luz.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 border border-purple-200 dark:border-purple-700">
        <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
          Outras Configurações
        </h3>
        <p className="text-purple-600 dark:text-purple-400">
          Mais opções de configuração estarão disponíveis em breve.
        </p>
      </div>
    </div>
  );
};

export default Configuracoes;
