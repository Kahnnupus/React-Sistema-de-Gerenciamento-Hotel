import React from "react";

const Home = () => {
  return (
    <div className="animacao-fade-in text-center py-12">
      <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-200 mb-4">
        Bem-vindo ao Sistema de Reserva de Hotéis
      </h1>
      <p className="text-lg text-purple-600 dark:text-purple-400 mb-8">
        Encontre e reserve os melhores hotéis para sua viagem.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md mx-auto border border-purple-200 dark:border-purple-700">
        <h2 className="text-2xl font-semibold mb-4 text-purple-800 dark:text-purple-200">
          Destaques
        </h2>
        <ul className="text-left space-y-2 text-purple-700 dark:text-purple-300">
          <li>• Hotéis de alta qualidade</li>
          <li>• Preços competitivos</li>
          <li>• Reserva fácil e rápida</li>
          <li>• Suporte ao cliente 24/7</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
