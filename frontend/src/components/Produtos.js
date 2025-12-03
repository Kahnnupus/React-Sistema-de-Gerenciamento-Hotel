import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";

const PaginaProdutos = () => {
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="animacao-fade-in">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Produtos
      </h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((produto) => (
          <div
            key={produto.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-purple-200 dark:border-purple-700"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
                {produto.nome}
              </h2>
              <p className="text-purple-600 dark:text-purple-400 mb-2">
                {produto.descricao}
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                R$ {produto.preco.toFixed(2)}
              </p>
              <Link
                to={`/produtos/${produto.id}`}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-purple-500 dark:text-purple-400 mt-8">
          Nenhum produto encontrado.
        </p>
      )}
    </div>
  );
};

export default PaginaProdutos;
