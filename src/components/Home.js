import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (destination.trim() === "") return;

    navigate(`/hoteis?city=${destination}`);
  };

  const highlights = [
    "Reserve agora, pague na acomodação",
    "+300 mil avaliações verificadas",
    "2 milhões+ de acomodações no mundo todo",
    "Atendimento ao cliente 24h",
  ];

  const destinations = [
    {
      name: "São Paulo",
      image:
        "https://images.unsplash.com/photo-1645918899630-85e2f3132a84?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    },
    {
      name: "Rio de Janeiro",
      image:
        "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1526",
    },
    {
      name: "Curitiba",
      image:
        "https://images.unsplash.com/photo-1716776543013-cf2589d08bc9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1167",
    },
    {
      name: "Belo Horizonte",
      image:
        "https://images.unsplash.com/photo-1554779954-447567fcc8e6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074",
    },
    {
      name: "Brasília",
      image:
        "https://images.unsplash.com/photo-1640655367482-fa9797fe1258?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1252",
    },
  ];

  return (
    <div className="animacao-fade-in min-h-screen py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-800 dark:text-purple-200">
          Encontre seu próximo destino
        </h1>
        <p className="text-lg text-purple-600 dark:text-purple-400 mt-2">
          Pesquise hotéis, confira os destaques e explore lugares do Brasil.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-purple-200 dark:border-purple-700 p-4 mb-12"
      >
        <input
          type="text"
          placeholder="Digite o destino..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="flex-1 px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition-colors"
        >
          Pesquisar
        </button>
      </form>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {highlights.map((text, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-purple-800 dark:text-purple-200 font-semibold text-lg">
              {text}
            </h3>
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-2">
        <h2 className="text-3xl font-bold text-purple-800 dark:text-purple-200">
          Destinos mais procurados
        </h2>
        <p className="text-purple-600 dark:text-purple-400 mb-6">
          Opções mais procuradas por viajantes do Brasil
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">
          {destinations.map((d, idx) => {
            const big = idx === 0 || idx === 1;
            const col = big ? "lg:col-span-6" : "lg:col-span-4";
            const h = big ? "h-64 md:h-72" : "h-56 md:h-60";
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => navigate(`/hoteis?city=${d.name}`)}
                className={`group relative overflow-hidden rounded-xl border border-purple-600 bg-gray-900/50 hover:bg-gray-900/70 text-left shadow-lg transition-all duration-500 ${col}`}
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className={`w-full ${h} object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500" />
                <h3
                  className="absolute top-3 left-4 text-white font-extrabold text-2xl"
                  style={{ textShadow: "0 3px 8px rgba(0,0,0,0.9)" }}
                >
                  {d.name}
                </h3>
                <div className="absolute inset-0 rounded-xl ring-2 ring-purple-500/70 shadow-[0_0_25px_#9333ea] group-hover:ring-purple-400 group-hover:shadow-[0_0_35px_#a855f7] transition-all duration-500" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
