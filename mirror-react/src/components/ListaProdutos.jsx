"use client"

import { useState, useEffect } from "react"
import { CardProduto } from "./CardProduto"
import styles from "../styles/ListaProdutos.module.css"
import { useLocation } from "react-router-dom"

export function ListaProdutos({ categorias, onProdutoClick, compact, refreshTrigger = 0 }) {
  const [produtosApi, setProdutosApi] = useState(null)
  const [loadingApi, setLoadingApi] = useState(false)
  const [error, setError] = useState(null)

  const location = useLocation()
  const isGerenciamento = location.pathname.startsWith("/novoPedido") || location.pathname.startsWith("/cardapioEditar")

  // Buscar produtos da API quando o componente monta ou quando refreshTrigger muda
  useEffect(() => {
    buscarProdutosDaApi()
  }, [refreshTrigger])

  const buscarProdutosDaApi = async () => {
    setLoadingApi(true)
    setError(null)
    try {
      console.log("🔍 Buscando produtos da API...")
      const response = await fetch("http://localhost:8080/api/itens-pedidos")
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      const data = await response.json()
      console.log("📦 Produtos recebidos da API:", data)
      setProdutosApi(data)
    } catch (err) {
      console.error("❌ Erro ao buscar produtos:", err)
      setError(err.message)
    } finally {
      setLoadingApi(false)
    }
  }

  const normalizeId = (titulo) =>
    titulo
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "") // remove acentos e caracteres especiais
      .toLowerCase()
      .replace(/\s+/g, "")

  // Função para mapear categorias com produtos da API
  const mapearCategoriasComProdutos = (categorias, dadosApi) => {
    if (!dadosApi) return categorias

    return categorias.map((categoria) => {
      const categoriaId = normalizeId(categoria.titulo)

      // Mapear nomes das categorias
      const mapeamento = {
        combos: "combos",
        hamburgueres: "hamburgueres",
        espetinhos: "espetinhos",
        adicionais: "adicionais",
        bebidas: "bebidas",
        porcoes: "porcoes",
      }

      const chaveApi = mapeamento[categoriaId] || categoriaId
      const produtosDaCategoria = dadosApi[chaveApi] || []

      return {
        ...categoria,
        produtos: produtosDaCategoria,
      }
    })
  }

  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-red-600 mb-4">Erro ao carregar produtos: {error}</p>
        <button onClick={buscarProdutosDaApi} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Tentar Novamente
        </button>
      </div>
    )
  }

  // Renderizar loading
  if (loadingApi) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando produtos...</span>
      </div>
    )
  }

  // Mapear categorias com produtos da API
  const categoriasComProdutos = mapearCategoriasComProdutos(categorias, produtosApi)

  const renderCategoria = (categoriaData) => {
    const categoriaKey = normalizeId(categoriaData.titulo)

    return (
      <div key={categoriaKey} id={categoriaKey} className={styles.categoriaContainer}>
        <div className="flex flex-row items-center justify-start mb-2 mt-2 gap-2">
          <span className="h-[25px] w-[6px] bg-amber-400"></span>
          <h2 className="text-[1.3rem] font-bold text-start text-[#CC0000]">{categoriaData.titulo}</h2>
        </div>
        <div className={`${styles.lista} ${compact ? styles.compact : ""}`}>
          {categoriaData.produtos && categoriaData.produtos.length > 0 ? (
            categoriaData.produtos.map((produto) => (
              <CardProduto
                key={`${categoriaKey}-${produto.id}`}
                id={produto.id}
                nome={produto.nome}
                tempo={produto.tempoPreparo}
                preco={produto.preco}
                imagem={produto.imagem}
                categoria={categoriaKey} // passa a categoria para o CardProduto
                isGerenciamento={isGerenciamento}
                onClick={!isGerenciamento ? () => onProdutoClick(produto) : undefined}
              />
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>Nenhum produto encontrado nesta categoria</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.containerListaProdutos} ${isGerenciamento ? styles.expandido : ""}`}>
      <div className={styles.listaProdutos}>{categoriasComProdutos.map(renderCategoria)}</div>
    </div>
  )
}
