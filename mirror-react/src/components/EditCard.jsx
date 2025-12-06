"use client";
import { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
export default function EditCard({ onClose, onProdutoAtualizado }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [form, setForm] = useState({
    id: "",
    nome: "",
    preco: "",
    tempoPreparo: "10-15 min",
    imagem: "/placeholder.svg",
    descricao: "",
    categoria: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState("/placeholder.svg");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const buscarProdutoSelecionado = async () => {
      const selecionado = localStorage.getItem("selecionadoUnico");
      console.log("Selecionado no localStorage:", selecionado);
      if (!selecionado) {
        setProdutoSelecionado(null);
        return;
      }
      const { id } = JSON.parse(selecionado);
      console.log("ID do produto selecionado:", id);
      try {
        const response = await fetch("http://localhost:8080/api/cardapio/menu");
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        const data = await response.json();
        console.log("Dados da API:", data);

        const menuData = data.menu || data;
        console.log("Menu data:", menuData);

        let produtoEncontrado = null;
        const categorias = [
          "combos",
          "hamburgueres",
          "espetinhos",
          "adicionais",
          "bebidas",
          "porcoes",
        ];
        for (const cat of categorias) {
          if (menuData[cat]) {
            console.log(
              `Buscando ID ${id} na categoria ${cat}:`,
              menuData[cat]
            );
            produtoEncontrado = menuData[cat].find(
              (produto) => produto.id === id
            );
            if (produtoEncontrado) {
              console.log(
                "Produto encontrado na categoria:",
                cat,
                produtoEncontrado
              );
              produtoEncontrado.categoria = cat;
              break;
            }
          }
        }
        if (produtoEncontrado) {
          setProdutoSelecionado(produtoEncontrado);

          setForm({
            id: produtoEncontrado.id,
            nome: produtoEncontrado.name || "",
            preco: produtoEncontrado.price?.toString().replace(".", ",") || "",
            tempoPreparo: produtoEncontrado.preparationTime || "10-15 min",
            imagem: produtoEncontrado.imageUrl || "/placeholder.svg",
            descricao: produtoEncontrado.description || "",
            categoria: produtoEncontrado.categoria,
          });
          setPreviewImage(produtoEncontrado.imageUrl || "/placeholder.svg");
        } else {
          console.warn("Produto não encontrado com ID:", id);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };
    buscarProdutoSelecionado();

    const handleSelecionadosUpdate = () => {
      buscarProdutoSelecionado();
    };
    window.addEventListener(
      "selecionadosAtualizados",
      handleSelecionadosUpdate
    );
    return () =>
      window.removeEventListener(
        "selecionadosAtualizados",
        handleSelecionadosUpdate
      );
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "preco") {
      const precoValue = value.replace(/[^0-9.,]/g, "");
      setForm((prev) => ({ ...prev, [name]: precoValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setForm((prev) => ({ ...prev, imagem: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!form.preco || form.preco === "0" || form.preco === "0,00") {
      newErrors.preco = "Preço deve ser maior que zero";
    }
    if (!form.descricao.trim()) newErrors.descricao = "Descrição é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const precoNumerico = parseFloat(form.preco.replace(",", "."));
      const payload = {
        name: form.nome.trim(),
        description: form.descricao.trim(),
        price: precoNumerico,
        preparationTime: form.tempoPreparo,
        imageUrl: form.imagem,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para atualizar produtos");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/cardapio/menu-items/${produtoCompleto.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar produto");
      const produtoAtualizado = await response.json();

      if (onProdutoAtualizado) {
        onProdutoAtualizado(produtoAtualizado);
      }
      setEditMode(false);
      alert("Produto atualizado com sucesso!");

      onClose();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      if (produtoSelecionado) {
        setForm({
          id: produtoSelecionado.id,
          nome: produtoSelecionado.nome || "",
          preco: produtoSelecionado.preco || "",
          tempoPreparo: produtoSelecionado.tempoPreparo || "10-15 min",
          imagem: produtoSelecionado.imagem || "/placeholder.svg",
          descricao: produtoSelecionado.descricao || "",
          categoria: produtoSelecionado.categoria,
        });
        setPreviewImage(produtoSelecionado.imagem || "/placeholder.svg");
      }
      setErrors({});
    }
  };

  if (!produtoSelecionado) {
    return (
      <div className="w-[350px] h-115 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center font-['Montserrat']">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Edit2 size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Nenhum produto selecionado
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Selecione um produto na lista para editá-lo
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-[350px] h-115 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
      {}
      <div className="flex justify-between items-center !p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold !m-0 text-gray-800">
          {editMode ? "Editando Produto" : "Detalhes do Produto"}
        </h2>
        <button
          className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-[#e30613] flex items-center justify-center !p-0"
          onClick={onClose}
          disabled={loading}
        >
          <X size={20} />
        </button>
      </div>
      {}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Produto:</strong> {produtoSelecionado.nome} (ID:{" "}
          {produtoSelecionado.id})
        </p>
        <p className="text-xs text-blue-600">
          <strong>Categoria:</strong> {produtoSelecionado.categoria}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col flex-1 !px-4 !py-2 overflow-y-auto"
      >
        {}
        <div className="!mb-3">
          <div className="flex flex-col items-center">
            <div className="w-[50%] h-[80px] border border-gray-300 rounded-md overflow-hidden !mb-1 flex items-center justify-center bg-gray-100">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {editMode && (
              <input
                type="file"
                id="imagem"
                name="imagem"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs"
              />
            )}
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="nome"
            className="block text-xs font-medium text-gray-700 !mb-1"
          >
            Nome do Produto
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            disabled={!editMode || loading}
            className={`w-full h-8 !p-2 text-sm border ${
              editMode ? "border-gray-300" : "border-transparent bg-gray-100"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800 disabled:bg-gray-100`}
          />
          {errors.nome && editMode && (
            <p className="text-[#e30613] text-xs !mt-1">{errors.nome}</p>
          )}
        </div>
        {}
        <div className="flex flex-row gap-2 !mb-3">
          <div className="w-1/2">
            <label
              htmlFor="preco"
              className="block text-xs font-medium text-gray-700 !mb-1"
            >
              Preço (R$)
            </label>
            <input
              type="text"
              id="preco"
              name="preco"
              value={form.preco}
              onChange={handleChange}
              disabled={!editMode || loading}
              placeholder="0,00"
              className={`w-full h-8 !p-2 text-sm border ${
                editMode ? "border-gray-300" : "border-transparent bg-gray-100"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800 disabled:bg-gray-100`}
            />
            {errors.preco && editMode && (
              <p className="text-[#e30613] text-xs !mt-1">{errors.preco}</p>
            )}
          </div>
          <div className="w-1/2">
            <label
              htmlFor="tempoPreparo"
              className="block text-xs font-medium text-gray-700 !mb-1"
            >
              Tempo de Preparo
            </label>
            {editMode ? (
              <select
                id="tempoPreparo"
                name="tempoPreparo"
                value={form.tempoPreparo}
                onChange={handleChange}
                disabled={loading}
                className="w-full h-8 !p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800 disabled:bg-gray-100"
              >
                <option value="0-5 min">0-5 minutos</option>
                <option value="5-10 min">5-10 minutos</option>
                <option value="10-15 min">10-15 minutos</option>
                <option value="15-20 min">15-20 minutos</option>
                <option value="20-25 min">20-25 minutos</option>
                <option value="20-30 min">20-30 minutos</option>
                <option value="+30 min">Mais de 30 minutos</option>
              </select>
            ) : (
              <input
                type="text"
                value={form.tempoPreparo}
                disabled
                className="w-full h-8 !p-2 text-sm border border-transparent bg-gray-100 rounded-md text-gray-800"
              />
            )}
          </div>
        </div>
        {}
        <div className="!mb-3">
          <label
            htmlFor="descricao"
            className="block text-xs font-medium text-gray-700 !mb-1"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            disabled={!editMode || loading}
            placeholder="Descreva o produto"
            className={`w-full !p-2 text-sm border ${
              editMode ? "border-gray-300" : "border-transparent bg-gray-100"
            } rounded-md min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800 disabled:bg-gray-100`}
          />
          {errors.descricao && editMode && (
            <p className="text-[#e30613] text-xs !mt-1">{errors.descricao}</p>
          )}
        </div>
        {}
        <div className="flex justify-end !mb-2 gap-2">
          {editMode ? (
            <>
              <button
                type="button"
                className="!px-3 !py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 font-medium disabled:opacity-50"
                onClick={toggleEditMode}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="!px-3 !py-1.5 text-sm border-none bg-[#e30613] text-white rounded-md hover:bg-[#c00] font-medium flex items-center gap-1 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check size={14} /> Salvar
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="!px-3 !py-1.5 text-sm border-none bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-1"
              onClick={toggleEditMode}
            >
              <Edit2 size={14} /> Editar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
