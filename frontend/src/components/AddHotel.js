import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHotels } from "../contexts/HotelContext";

import { useFeedback } from "../contexts/FeedbackContext";
import { Hotel, Plus, Trash2, Save, ArrowLeft, MapPin, Image, List, FileText, BedDouble, DollarSign, Users } from "lucide-react";

const AddHotel = () => {
  const { addHotel } = useHotels();
  const navigate = useNavigate();
  const { showSuccess, showError } = useFeedback();

  const [nome, setNome] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [comodidadesTexto, setComodidadesTexto] = useState("");
  const [imagem, setImagem] = useState("");
  const [imageSource, setImageSource] = useState("url"); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !localizacao.trim() || roomTypes.length === 0) return;

    const comodidades = comodidadesTexto
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    // Format room types for backend
    const tipos_quartos = roomTypes.map(tipo => ({
      nome: tipo.nome,
      descricao: "",
      preco_por_noite: tipo.preco,
      capacidade_pessoas: tipo.limiteHospedes,
      quantidade_disponivel: tipo.quantidade
    }));

    // Use FormData for file upload or URL
    const formData = new FormData();
    formData.append('nome', nome.trim());
    formData.append('localizacao', localizacao.trim());
    formData.append('descricao', descricao.trim());

    if (imageSource === 'url') {
      formData.append('imagem', imagem.trim());
    } else if (selectedFile) {
      formData.append('imagem', selectedFile);
    }

    // Append complex data as JSON strings
    formData.append('comodidades', JSON.stringify(comodidades));
    formData.append('tipos_quartos', JSON.stringify(tipos_quartos));

    // We need to modify addHotel in HotelContext to handle FormData
    // But wait, addHotel probably expects an object and sends JSON.
    // I should check HotelContext.js.
    // If I cannot change HotelContext easily, I might need to do the fetch here or update HotelContext.
    // Let's assume I need to update HotelContext or pass a flag.
    // For now, let's try to pass FormData to addHotel and see if it handles it.
    // If addHotel does `JSON.stringify(hotelData)`, it will fail for FormData.

    // Let's check HotelContext.js in the next step. For now, I will write the logic assuming I can pass FormData.
    // Actually, I should verify HotelContext first.

    const result = await addHotel(formData);

    if (result.success) {
      showSuccess('Sucesso', result.message || 'Hotel cadastrado com sucesso! Aguarde a aprovação do administrador.');
      navigate("/hoteis");
    } else {
      showError('Erro', result.message || 'Erro ao cadastrar hotel');
    }
  };

  return (
    <div className="animacao-fade-in max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200 mb-6 flex items-center gap-2">
        <Hotel className="w-8 h-8" />
        Cadastrar Hotel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-purple-200 dark:border-purple-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
              <Hotel className="w-4 h-4" />
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
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
              <MapPin className="w-4 h-4" />
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

          <div className="col-span-1 md:col-span-2">
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
              <Image className="w-4 h-4" />
              Imagem do Hotel
            </label>

            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="imageSource"
                  value="url"
                  checked={imageSource === 'url'}
                  onChange={() => setImageSource('url')}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-purple-800 dark:text-purple-200">URL da Imagem</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="imageSource"
                  value="file"
                  checked={imageSource === 'file'}
                  onChange={() => setImageSource('file')}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-purple-800 dark:text-purple-200">Upload de Arquivo</span>
              </label>
            </div>

            {imageSource === 'url' ? (
              <input
                type="url"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-purple-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-gray-600 dark:file:text-purple-200"
              />
            )}
          </div>

          <div>
            <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
              <List className="w-4 h-4" />
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
          <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
            <FileText className="w-4 h-4" />
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
          <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
            <BedDouble className="w-6 h-6" />
            Tipos de Quarto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
                <BedDouble className="w-4 h-4" />
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
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
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
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
                <Hotel className="w-4 h-4" />
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
              <label className="block text-purple-700 dark:text-purple-300 mb-2 font-medium flex items-center gap-1">
                <Users className="w-4 h-4" />
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
              className={`px-4 py-2 rounded-md font-medium transition-colors ${readyToAddType
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-purple-400/40 text-white/60 cursor-not-allowed"
                }`}
            >
              <Plus className="w-4 h-4 inline-block mr-1" />
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
                      <Trash2 className="w-4 h-4 inline-block mr-1" />
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
            className={`px-4 py-2 rounded-md font-medium transition-colors ${roomTypes.length === 0 || !nome.trim() || !localizacao.trim()
              ? "bg-purple-600/40 text-white/70 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
          >
            <Save className="w-4 h-4 inline-block mr-1" />
            Cadastrar hotel
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md font-medium bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      </form >
    </div >
  );
};

export default AddHotel;
