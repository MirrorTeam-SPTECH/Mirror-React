"use client";
import { useState, useEffect } from "react";
import { CardProduto } from "./CardProduto";
import styles from "../styles/ListaProdutos.module.css";
import { useLocation } from "react-router-dom";
import menuService from "../services/menuService";
export function ListaProdutos({
  categorias,
  onProdutoClick,
  compact,
  refreshTrigger = 0,
}) {
  const [produtosApi, setProdutosApi] = useState(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isGerenciamento =
    location.pathname.startsWith("/novoPedido") ||
    location.pathname.startsWith("/cardapioEditar");

  useEffect(() => {
    buscarProdutosDaApi();
  }, [refreshTrigger]);
  const buscarProdutosDaApi = async () => {
    setLoadingApi(true);
    setError(null);
    try {
      console.log("🔍 Buscando produtos da API...");
      const data = await menuService.getAllItems();
      console.log("📦 Produtos recebidos da API:", data);

      if (data?.menu) {
        const primeiraCategoria = Object.keys(data.menu)[0];
        const primeiroProduto = data.menu[primeiraCategoria]?.[0];
        console.log("🔍 Estrutura de um produto:", primeiroProduto);
      }
      setProdutosApi(data);
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err);
      setError(err.message || "Erro ao buscar produtos");
    } finally {
      setLoadingApi(false);
    }
  };
  const normalizeId = (titulo) =>
    titulo
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "");

  const mapearCategoriasComProdutos = (categorias, dadosApi) => {
    if (!dadosApi) return categorias;

    const menuData = dadosApi.menu || dadosApi;
    return categorias.map((categoria) => {
      const categoriaId = normalizeId(categoria.titulo);

      const mapeamento = {
        combos: "combos",
        hamburgueres: "hamburgueres",
        espetinhos: "espetinhos",
        adicionais: "adicionais",
        bebidas: "bebidas",
        porcoes: "porcoes",
      };
      const chaveApi = mapeamento[categoriaId] || categoriaId;
      const produtosDaCategoria = menuData[chaveApi] || [];
      return {
        ...categoria,
        produtos: produtosDaCategoria,
      };
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-red-600 mb-4">
          Erro ao carregar produtos:{" "}
          {error?.message ||
            error?.response?.data?.message ||
            "Erro desconhecido"}
        </p>
        <button
          onClick={buscarProdutosDaApi}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (loadingApi) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando produtos...</span>
      </div>
    );
  }

  const categoriasComProdutos = mapearCategoriasComProdutos(
    categorias,
    produtosApi
  );
  const renderCategoria = (categoriaData) => {
    const categoriaKey = normalizeId(categoriaData.titulo);
    return (
      <div
        key={categoriaKey}
        id={categoriaKey}
        className={styles.categoriaContainer}
      >
        <div className="flex flex-row items-center justify-start mb-2 mt-2 gap-2">
          <span className="h-[25px] w-[6px] bg-amber-400"></span>
          <h2 className="text-[1.3rem] font-bold text-start text-[#CC0000]">
            {categoriaData.titulo}
          </h2>
        </div>
        <div className={`${styles.lista} ${compact ? styles.compact : ""}`}>
          {categoriaData.produtos && categoriaData.produtos.length > 0 ? (
            categoriaData.produtos.map((produto) => (
              <CardProduto
                key={`${categoriaKey}-${produto.id}`}
                id={produto.id}
                nome={produto.name || produto.nome}
                tempo={
                  produto.preparationTime ||
                  produto.preparation_time ||
                  produto.tempoPreparo
                }
                preco={produto.price || produto.preco}
                imagem={produto.imageUrl || produto.image_url || produto.imagem}
                categoria={categoriaKey}
                isGerenciamento={isGerenciamento}
                onClick={
                  !isGerenciamento ? () => onProdutoClick(produto) : undefined
                }
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Nenhum produto encontrado nesta categoria</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  return (
    <div
      className={`${styles.containerListaProdutos} ${
        isGerenciamento ? styles.expandido : ""
      }`}
    >
      <div className={styles.listaProdutos}>
        {categoriasComProdutos.map(renderCategoria)}
      </div>
    </div>
  );
}