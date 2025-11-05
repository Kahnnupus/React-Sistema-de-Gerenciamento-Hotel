import React, { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    {
      id: 1,
      nome: "Produto 1",
      preco: 10.99,
      descricao: "Descrição do Produto 1",
      imagem: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      nome: "Produto 2",
      preco: 20.99,
      descricao: "Descrição do Produto 2",
      imagem: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      nome: "Produto 3",
      preco: 30.99,
      descricao: "Descrição do Produto 3",
      imagem: "https://via.placeholder.com/150",
    },
  ]);

  const addProduct = (product) => {
    setProducts((prev) => [...prev, { ...product, id: Date.now() }]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
};
