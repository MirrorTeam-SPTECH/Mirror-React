"use client"

import { useEffect, useState } from "react"
import HeaderGerenciamento from "../components/HeaderGerenciamento"
import { Pesquisa } from "../components/Pesquisa"
import NavigationBar from "../components/NavigationBar"
import ControlePedidos from "../components/ControlePedidos"
import { ListaProdutos } from "../components/ListaProdutos"
import CreateCard from "../components/CreateCard"
import EditCard from "../components/EditCard"
import DeleteConfirmation from "../components/DeleteConfirmation"
import { todasCategorias } from "../utils/Categorias"
import "../styles/Carregamento.css"

export default function CardapioEditar() {
  const [loading, setLoading] = useState(true)
  const [cardAberto, setCardAberto] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0) // Para forçar recarregamento

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleCardClose = () => {
    setCardAberto(null)
  }

  // Função para ser chamada quando um produto é criado/editado/deletado
  const handleProdutoModificado = () => {
    console.log("✅ Produto modificado, recarregando lista...")
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <div className="containerProjeto">
      {loading ? (
        <>
          <div className="skeleton headerGerenciamento-skeleton"></div>
          <div className="skeleton pesquisa-skeleton" />
          <div className="skeleton nav-skeleton" />
          {todasCategorias.map((_, i) => (
            <div className="skeleton lista-produto-skeleton" key={i}>
              <div className="categoria-titulo-skeleton skeleton" />
              <div className="produtos-grid-skeleton">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <div className="produto-card-skeleton skeleton" key={j} />
                  ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <HeaderGerenciamento activePage="cardapio" />
          <ControlePedidos
            titulo="Editar Cardápio"
            onCriar={() => setCardAberto("criar")}
            onAtualizar={() => setCardAberto("editar")}
            onDeletar={() => setCardAberto("deletar")}
          />
          <Pesquisa />
          <div className="flex w-full !mb-0">
            <div className={cardAberto ? "flex-3 w-[70%]" : "w-full"}>
              <NavigationBar />
              {/* Passar refreshTrigger para forçar recarregamento automático */}
              <ListaProdutos categorias={todasCategorias} compact={false} refreshTrigger={refreshTrigger} />
            </div>
            {cardAberto && (
              <div className="flex-1 !-mt-25 !mr-17 w-[30%] flex flex-col items-center justify-center">
                {cardAberto === "criar" && (
                  <CreateCard onClose={handleCardClose} onProdutoCriado={handleProdutoModificado} />
                )}
                {cardAberto === "editar" && (
                  <EditCard onClose={handleCardClose} onProdutoAtualizado={handleProdutoModificado} />
                )}
                {cardAberto === "deletar" && (
                  <DeleteConfirmation onClose={handleCardClose} onProdutoRemovido={handleProdutoModificado} />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
