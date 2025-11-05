import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";

const PaginaDetalhesProduto = () => {
  const { id } = useParams();
  const navegar = useNavigate();

  const { products } = useProducts();
  const { addToCart } = useCart();

  const produto = products.find((p) => p.id === parseInt(id));

  if (!produto) {
    return (
      <div className="animacao-fade-in text-center py-12">
        <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-4">
          Produto não encontrado
        </h1>
        <button
          onClick={() => navegar(-1)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(produto);
    alert("Produto adicionado ao carrinho!");
  };

  return (
    <div className="animacao-fade-in max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-purple-200 dark:border-purple-700">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-4">
              {produto.nome}
            </h1>
            <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              R$ {produto.preco.toFixed(2)}
            </p>
            <p className="text-purple-600 dark:text-purple-400 mb-6">
              {produto.descricao}
            </p>
            <div className="space-x-4">
              <button
                onClick={handleAddToCart}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Adicionar ao Carrinho
              </button>
              <button
                onClick={() => navegar(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetalhesProduto;
