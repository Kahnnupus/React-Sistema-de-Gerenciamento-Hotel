import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="animacao-fade-in text-center py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
          Página Não Encontrada
        </h2>
        <p className="text-purple-600 dark:text-purple-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
