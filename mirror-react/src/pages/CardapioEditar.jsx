"use client"

import { useEffect, useState } from "react"
import HeaderGerenciamento from "../components/HeaderGerenciamento"
import { Pesquisa } from "../components/Pesquisa"
import NavigationBarGerenciamento from "../components/NavigationBarGerenciamento"
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

  const [categoriasState, setCategoriasState] = useState([...todasCategorias]);

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

  // ─── Função para adicionar no estado local o novo item criado ───────
const handleProdutoCriado = (novoItem) => {
  // Função utilitária para “normalizar” títulos, igual ao ListaProdutos usa internamente
  const normalizeId = (titulo) =>
    titulo
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "");

  setCategoriasState((prev) =>
    prev.map((cat) => {
      // Se o “normalizeId(titulo da categoria)” for igual ao “novoItem.categoria”,
      // significa que esse novo item pertence a esta categoria de produtos.
      if (normalizeId(cat.titulo) === novoItem.categoria) {
        return {
          ...cat,
          produtos: [
            ...cat.produtos,
            { ...novoItem }
          ],
        };
      }
      return cat;
    })
  );
};
// ───────────────────────────────────────────────────────────────────────


   

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
<<<<<<< HEAD
              <NavigationBar />
               <ListaProdutos
              categorias={categoriasState}    // ── usa o estado clonado, não mais todasCategorias diretamente
               isGerenciamento={true}
             />
            </div>
            {cardAberto && (
              <div className="flex-1 !-mt-25 !mr-17 w-[30%] flex flex-col items-center justify-center">
                {cardAberto === "criar" && <CreateCard
                   onClose={() => setCardAberto(null)}
                   onProdutoCriado={handleProdutoCriado} // ── passa a função que insere no estado
                 />}
                {cardAberto === "editar" && <EditCard onClose={() => setCardAberto(null)} />}
                {cardAberto === "deletar" && <DeleteConfirmation onClose={() => setCardAberto(null)} />}
=======
              <NavigationBarGerenciamento />
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
>>>>>>> 685f498b886d356c13ccf31e59a4a11107ecbf0e
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
