import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";

const AddHotel = () => {
  const { addHotel } = useHotels();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [comodidadesTexto, setComodidadesTexto] = useState("");
  const [imagem, setImagem] = useState("");

  const [roomTypes, setRoomTypes] = useState([]);
  const [tipoAtual, setTipoAtual] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    limiteHospedes: "",
  });

  const readyToAddType =
    tipoAtual.nome.trim() !== "" &&
    tipoAtual.preco !== "" &&
    !isNaN(Number(tipoAtual.preco)) &&
    tipoAtual.quantidade !== "" &&
    !isNaN(Number(tipoAtual.quantidade)) &&
    tipoAtual.limiteHospedes !== "" &&
    !isNaN(Number(tipoAtual.limiteHospedes));

  const handleAddType = () => {
    if (!readyToAddType) return;
    const novo = {
      nome: tipoAtual.nome.trim(),
      preco: Number(tipoAtual.preco),
      quantidade: Number(tipoAtual.quantidade),
      limiteHospedes: Number(tipoAtual.limiteHospedes),
    };
    setRoomTypes((prev) => [...prev, novo]);
    setTipoAtual({ nome: "", preco: "", quantidade: "", limiteHospedes: "" });
  };

  const handleRemoveType = (idx) => {
    setRoomTypes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !localizacao.trim() || roomTypes.length === 0) return;

    const comodidades = comodidadesTexto
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    const menorPreco =
      roomTypes.length > 0
        ? roomTypes.reduce(
            (min, t) => Math.min(min, t.preco),
            roomTypes[0].preco
          )
        : 0;

    const novoHotel = {
      id: Date.now(),
      nome: nome.trim(),
      localizacao: localizacao.trim(),
      descricao: descricao.trim(),
      imagem: imagem.trim(),
      comodidades,
      precoPorNoite: menorPreco,
      roomTypes,
    };

    addHotel(novoHotel);
    navigate("/hoteis");
  };

  return (
    <div className="animacao-fade-in max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6">
        Cadastrar Hotel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Nome do Hotel
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Localização
            </label>
            <input
              type="text"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Imagem (URL)
            </label>
            <input
              type="url"
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            />
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
              Comodidades (separe por vírgula)
            </label>
            <input
              type="text"
              value={comodidadesTexto}
              onChange={(e) => setComodidadesTexto(e.target.value)}
              placeholder="Wi-Fi, Café da manhã, Piscina"
              className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows="4"
            placeholder="Fale sobre o hotel, localização, diferenciais, etc."
            className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
            required
          />
        </div>

        <div className="mt-8 border-t border-purple-200 dark:border-purple-700 pt-6">
          <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">
            Tipos de Quarto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
                Tipo
              </label>
              <input
                type="text"
                value={tipoAtual.nome}
                onChange={(e) =>
                  setTipoAtual((p) => ({ ...p, nome: e.target.value }))
                }
                placeholder="Ex.: Standard, Suíte Master, etc."
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            </div>

            <div>
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
                Preço/noite (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tipoAtual.preco}
                onChange={(e) =>
                  setTipoAtual((p) => ({ ...p, preco: e.target.value }))
                }
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            </div>

            <div>
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
                Qtde disponível
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={tipoAtual.quantidade}
                onChange={(e) =>
                  setTipoAtual((p) => ({ ...p, quantidade: e.target.value }))
                }
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            </div>

            <div>
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium">
                Limite hóspedes
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={tipoAtual.limiteHospedes}
                onChange={(e) =>
                  setTipoAtual((p) => ({
                    ...p,
                    limiteHospedes: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddType}
              disabled={!readyToAddType}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                readyToAddType
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-purple-400/40 text-white/60 cursor-not-allowed"
              }`}
            >
              Adicionar tipo
            </button>
          </div>

          {roomTypes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Tipos adicionados
              </h3>
              <ul className="space-y-2">
                {roomTypes.map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-md border border-purple-200 dark:border-purple-700 p-3 bg-purple-50/40 dark:bg-gray-700/40"
                  >
                    <span className="text-sm text-purple-800 dark:text-purple-200">
                      {t.nome} — R$ {t.preco.toFixed(2)} · {t.quantidade}{" "}
                      quarto(s) · até {t.limiteHospedes} hóspede(s)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveType(i)}
                      className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="submit"
            disabled={
              roomTypes.length === 0 || !nome.trim() || !localizacao.trim()
            }
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              roomTypes.length === 0 || !nome.trim() || !localizacao.trim()
                ? "bg-purple-600/40 text-white/70 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Cadastrar hotel
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md font-medium bg-gray-600 text-white hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;
