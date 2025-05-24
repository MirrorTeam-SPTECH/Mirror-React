"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { Favoritos as CardFav } from "../components/CardFavoritos"
import { SubNavigation } from "../components/SubNavigation"
import produtosData from "../data/produtos.json"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "../styles/Favoritos.css"

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)

  // Função para carregar favoritos do localStorage
  const carregarFavoritos = () => {
    // 1) pega do storage
    const favsStorage = JSON.parse(localStorage.getItem("favoritos")) || []

    // 2) mapeia para objetos completos do JSON
    const favsCompletos = favsStorage
      .filter(Boolean) // Remover itens nulos/undefined
      .map(({ id, categoria }) => {
        const lista = produtosData[categoria]
        if (!lista) {
          console.warn(`Categoria inexistente: ${categoria}`)
          return null
        }
        const produto = lista.find((item) => item.id === id)
        if (!produto) {
          console.warn(`Produto não encontrado em ${categoria} com id ${id}`)
          return null
        }
        // Adiciona a categoria ao produto para uso no HeartButton
        return { ...produto, categoria }
      })
      .filter(Boolean) // Remover itens nulos

    setFavoritos(favsCompletos)
    setLoading(false)
  }

  useEffect(() => {
    carregarFavoritos()

    // Atualizar quando os favoritos forem alterados em outro componente
    const handleFavoritosUpdate = () => {
      carregarFavoritos()
    }

    window.addEventListener("favoritosAtualizados", handleFavoritosUpdate)
    return () => window.removeEventListener("favoritosAtualizados", handleFavoritosUpdate)
  }, [])

  const handleRemoveFavorito = (id, categoria) => {
    // Remove do estado local
    setFavoritos((prev) => prev.filter((fav) => !(fav.id === id && fav.categoria === categoria)))

    // Remove do localStorage
    const favsStorage = JSON.parse(localStorage.getItem("favoritos")) || []
    const novosFavs = favsStorage.filter((fav) => !(fav.id === id && fav.categoria === categoria))
    localStorage.setItem("favoritos", JSON.stringify(novosFavs))

    // Notificar outros componentes
    window.dispatchEvent(new Event("favoritosAtualizados"))
  }

  if (loading) {
    return <div className="carregando">Carregando...</div>
  }

  return (
    <div className="favoritos-page  !-mt-15">
      <Header titulo="Favoritos" p="Seus itens favoritos" />

      <div className="favoritos-page-container !ml-5">
        <h1 className="text-3xl font-bold mb-4">Favoritos</h1>

        <div className="div_favoritos-wrapper">
          {favoritos.length > 0 && (
            <button
              className="btn-carrossel esquerda"
              onClick={() => {
                const carrossel = document.getElementById("carrosselFavoritos")
                carrossel.scrollLeft -= 350
              }}
            >
              <ChevronLeft color="red" size={20} />
            </button>
          )}

          <div className="div_favoritos " id="carrosselFavoritos">
            {favoritos.map((item) => (
              <CardFav
                key={`${item.id}-${item.categoria}`}
                id={item.id}
                categoria={item.categoria}
                nome={item.nome}
                valor={`R$ ${item.preco}`}
                descricao={item.descricao}
                imagem={item.imagem}
                onRemove={handleRemoveFavorito}
              />
            ))}
          </div>

          {favoritos.length > 0 && (
            <button
              className="btn-carrossel direita"
              onClick={() => {
                const carrossel = document.getElementById("carrosselFavoritos")
                carrossel.scrollLeft += 350
              }}
            >
              <ChevronRight color="red" size={20} />
            </button>
          )}
        </div>
      </div>

      <SubNavigation />
    </div>
  )
}
