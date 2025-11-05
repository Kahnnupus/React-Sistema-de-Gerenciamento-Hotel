import React, { useState } from "react";
import { useProducts } from "../contexts/ProductContext";

const AddProduct = () => {
  const { addProduct } = useProducts();

  const [newProduct, setNewProduct] = useState({
    nome: "",
    preco: "",
    descricao: "",
    imagem: "",
  });

  const [productImage, setProductImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductImage(e.target.result);
        setNewProduct((prev) => ({ ...prev, imagem: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newProduct.nome && newProduct.preco && newProduct.descricao) {
      addProduct({
        ...newProduct,
        preco: parseFloat(newProduct.preco),
        imagem: newProduct.imagem || "https://via.placeholder.com/150",
      });
      setNewProduct({ nome: "", preco: "", descricao: "", imagem: "" });
      setProductImage(null);
      alert("Produto adicionado com sucesso!");
    }
  };

  return (
    <div className="animacao-fade-in">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Adicionar Produto
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md border border-purple-200 dark:border-purple-700"
      >
        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Nome do Produto
          </label>
          <input
            type="text"
            name="nome"
            value={newProduct.nome}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Preço
          </label>
          <input
            type="number"
            name="preco"
            value={newProduct.preco}
            onChange={handleInputChange}
            step="0.01"
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Descrição
          </label>
          <textarea
            name="descricao"
            value={newProduct.descricao}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            rows="3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Imagem do Produto
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
          />
          {productImage && (
            <img
              src={productImage}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-md border border-purple-300"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Adicionar Produto
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
