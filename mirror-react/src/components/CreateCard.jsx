"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CreateCard({
  produto = null,
  onClose,
  mode = "create",
  onProdutoCriado,
}) {
  const [form, setForm] = useState({
    id: produto?.id || Date.now(),
    nome: produto?.nome || "",
    preco: produto?.preco || "",
    tempoPreparo: produto?.tempoPreparo || "10-15 min",
    imagem: produto?.imagem || "/placeholder.svg",
    descricao: produto?.descricao || "",
    categoria: produto?.categoria || "",
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(form.imagem);

  useEffect(() => {
    if (produto) {
      setForm({
        id: produto.id,
        nome: produto.nome || "",
        preco: produto.preco || "",
        tempoPreparo: produto.tempoPreparo || "10-15 min",
        imagem: produto.imagem || "/placeholder.svg",
        descricao: produto.descricao || "",
        categoria: produto.categoria || "",
      });
      setPreviewImage(produto.imagem || "/placeholder.svg");
    }
  }, [produto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "preco") {
      // Permitir apenas números, vírgula e ponto
      const precoValue = value.replace(/[^0-9.,]/g, "");
      setForm((old) => ({
        ...old,
        [name]: precoValue,
      }));
    } else {
      setForm((old) => ({ ...old, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setForm((old) => ({ ...old, imagem: reader.result }));
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
    if (!form.categoria.trim()) newErrors.categoria = "Categoria é obrigatória";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Preparar payload - manter preço como string para consistência com o JSON
    const payload = {
      nome: form.nome.trim(),
      preco: form.preco, // Manter como string
      tempoPreparo: form.tempoPreparo,
      imagem: form.imagem,
      descricao: form.descricao.trim(),
      categoria: form.categoria,
    };

    console.log("Enviando payload:", JSON.stringify(payload, null, 2));

    fetch("http://localhost:8080/api/itens-pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao criar novo item");
        return res.json();
      })
      .then((novoItem) => {
        // Chama a função que veio do CardapioEditar para atualizar o estado
        if (onProdutoCriado) {
          onProdutoCriado(novoItem);
        }
        // Fecha o modal
        onClose();
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao criar produto: " + err.message);
      });
  };

  return (
    <div className="w-[350px] h-115 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
      <div className="flex justify-between items-center !p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold !m-0 text-gray-800">
          {mode === "create"
            ? "Novo Produto"
            : mode === "update"
            ? "Atualizar Produto"
            : "Detalhes do Produto"}
        </h2>
        <button
          className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-[#e30613] flex items-center justify-center !p-0"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      <div className="!mb-3">
        <div className="flex flex-col !mt-2 items-center">
          <div className="w-[50%] h-[80px] border border-gray-300 rounded-md overflow-hidden !mb-1 flex items-center justify-center bg-gray-100">
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {mode !== "view" && (
            <input
              type="file"
              id="imagem"
              name="imagem"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-gray-500 file:mr-2 file:!py-1 file:!px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="!px-4 !py-2 overflow-y-auto flex-1"
      >
        {/* Nome e Categoria em linha */}
        <div className="flex flex-row !gap-2">
          {/* Nome */}
          <div className="!mb-3 flex-1">
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
              placeholder="Nome do produto"
              disabled={mode === "view"}
              className="w-full h-8 !p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
            />
            {errors.nome && (
              <p className="text-[#e30613] text-xs !mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="!mb-3 flex-1">
            <label
              htmlFor="categoria"
              className="block text-xs font-medium text-gray-700 !mb-1"
            >
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              disabled={mode === "view"}
              className="w-full h-8 !p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
            >
              <option value="">Selecione a categoria</option>
              <option value="combos">Combos</option>
              <option value="hamburgueres">Hambúrgueres</option>
              <option value="espetinhos">Espetinhos</option>
              <option value="adicionais">Adicionais</option>
              <option value="bebidas">Bebidas</option>
              <option value="porcoes">Porções</option>
            </select>
            {errors.categoria && (
              <p className="text-[#e30613] text-xs !mt-1">{errors.categoria}</p>
            )}
          </div>
        </div>

        {/* Preço e Tempo de Preparo */}
        <div className="flex flex-row gap-2">
          <div className="!mb-3 flex-1">
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
              placeholder="0,00"
              disabled={mode === "view"}
              className="w-full h-8 !p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
            />
            {errors.preco && (
              <p className="text-[#e30613] text-xs !mt-1">{errors.preco}</p>
            )}
          </div>
          <div className="!mb-3 flex-1">
            <label
              htmlFor="tempoPreparo"
              className="block text-xs font-medium text-gray-700 !mb-1"
            >
              Tempo de Preparo
            </label>
            <select
              id="tempoPreparo"
              name="tempoPreparo"
              value={form.tempoPreparo}
              onChange={handleChange}
              disabled={mode === "view"}
              className="w-full h-8 !p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
            >
              <option value="0-5 min">0-5 minutos</option>
              <option value="5-10 min">5-10 minutos</option>
              <option value="10-15 min">10-15 minutos</option>
              <option value="15-20 min">15-20 minutos</option>
              <option value="20-25 min">20-25 minutos</option>
              <option value="20-30 min">20-30 minutos</option>
              <option value="+30 min">Mais de 30 minutos</option>
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div className="!mb-1">
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
            placeholder="Descreva o produto"
            disabled={mode === "view"}
            className="w-full !p-2 text-sm border border-gray-300 rounded-md min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
          />
          {errors.descricao && (
            <p className="text-[#e30613] text-xs !mt-1">{errors.descricao}</p>
          )}
        </div>

        {/* Botões */}
        {mode !== "view" && (
          <div className="flex justify-end !mt-auto !mb-2 gap-2">
            <button
              type="button"
              className="!px-3 !py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="!px-3 !py-1.5 text-sm border-none bg-[#e30613] text-white rounded-md hover:bg-[#c00] font-medium"
            >
              {mode === "create" ? "Criar" : "Salvar"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
