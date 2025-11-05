"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmation({ onClose, onProdutoRemovido }) {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [produtoCompleto, setProdutoCompleto] = useState(null);

  // Buscar o produto selecionado e seus dados completos
  useEffect(() => {
    const buscarProdutoCompleto = async () => {
      const selecionado = localStorage.getItem("selecionadoUnico");
      if (!selecionado) {
        setProdutoCompleto(null);
        return;
      }

      const { id } = JSON.parse(selecionado);

      try {
        // Buscar todos os produtos da API para pegar os dados completos
        const response = await fetch("http://localhost:8080/api/menu-items");
        if (!response.ok) throw new Error("Erro ao buscar produtos");

        const data = await response.json();

        // A API retorna { menu: { categoria: [...] } }
        const menuData = data.menu || data;

        // Encontrar o produto específico
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
            produtoEncontrado = menuData[cat].find(
              (produto) => produto.id === id
            );
            if (produtoEncontrado) {
              produtoEncontrado.categoria = cat; // Adicionar categoria ao produto
              break;
            }
          }
        }

        setProdutoCompleto(produtoEncontrado);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setError("Erro ao carregar dados do produto");
      }
    };

    buscarProdutoCompleto();
  }, []);

  // Se não há produto selecionado ou ainda está carregando
  if (!produtoCompleto) {
    return (
      <div className="w-[350px] h-115 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center font-['Montserrat']">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {error ? "Erro ao carregar produto" : "Carregando produto..."}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {error ||
              "Aguarde enquanto carregamos os dados do produto selecionado"}
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

  // Usar o nome do produto como texto de confirmação (API retorna 'name' em inglês)
  const confirmationText = produtoCompleto.name;
  const isConfirmEnabled = confirmText === confirmationText;

  const handleConfirm = async () => {
    if (confirmText !== confirmationText) {
      setError("O texto digitado não corresponde ao nome do produto.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Obter token de autenticação
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para deletar produtos");
        return;
      }

      // Fazer chamada direta à API
      const response = await fetch(
        `http://localhost:8080/api/menu-items/${produtoCompleto.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Limpar a seleção do localStorage
      localStorage.removeItem("selecionadoUnico");
      // Disparar evento para atualizar componentes que dependem da seleção
      window.dispatchEvent(new Event("selecionadosAtualizados"));

      // Notificar o componente pai para recarregar a lista
      if (onProdutoRemovido) {
        onProdutoRemovido(produtoCompleto);
      }

      alert(`Produto "${produtoCompleto.name}" excluído com sucesso!`);

      // Fechar o modal
      onClose();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      setError(
        `Erro ao excluir: ${
          err instanceof Error ? err.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[350px] h-115 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
      <div className="text-[#e30613] !mb-6 flex justify-center pt-6">
        <AlertTriangle size={48} />
      </div>
      <div className="!px-6 flex-1 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 !mt-0 !mb-4 text-center">
          Excluir Produto
        </h2>

        {/* Card com informações do produto */}
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-red-300 rounded-md overflow-hidden flex items-center justify-center bg-white">
              <img
                src={produtoCompleto.imageUrl || "/placeholder.svg"}
                alt={produtoCompleto.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">
                {produtoCompleto.name}
              </p>
              <p className="text-xs text-red-600">
                ID: {produtoCompleto.id} • {produtoCompleto.categoria}
              </p>
              <p className="text-xs text-red-600">
                Preço: R$ {produtoCompleto.price}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 !mb-4 leading-relaxed text-center">
          Você está prestes a excluir <strong>"{produtoCompleto.name}"</strong>{" "}
          do cardápio. Esta ação não pode ser desfeita.
        </p>
        <p className="text-gray-600 !mb-4 text-center">
          Para confirmar, digite o nome exato do produto abaixo:
        </p>

        <div className="!mt-5 !mb-6">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={`Digite "${confirmationText}"`}
            className="w-full !p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
            disabled={loading}
          />
          {error && (
            <p className="text-[#e30613] text-xs text-left !mt-1">
              {typeof error === "string"
                ? error
                : error?.message || "Erro ao processar"}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-3 !mb-8">
          <button
            className="!px-4 !py-2.5 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`!px-4 !py-2.5 border-none ${
              isConfirmEnabled && !loading
                ? "bg-[#e30613] hover:bg-[#c00]"
                : "bg-red-200 cursor-not-allowed"
            } text-white rounded-md font-medium flex items-center justify-center gap-2`}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled || loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Excluindo...
              </>
            ) : (
              "Excluir Produto"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
