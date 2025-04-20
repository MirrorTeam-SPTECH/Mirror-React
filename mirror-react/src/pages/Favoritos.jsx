"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { Favoritos } from "../components/CardFavoritos"
import { SubNavigation } from "../components/SubNavigation"
import produtosData from "../data/produtos.json"
import "../styles/Favoritos.css"
import "../styles/FavoritosLoading.css"
import "../styles/Carregamento.css"

function scrollCarrossel(direcao) {
  const carrossel = document.getElementById("carrosselFavoritos")
  const larguraCard = 350
  if (direcao === "direita") {
    carrossel.scrollLeft += larguraCard
  } else {
    carrossel.scrollLeft -= larguraCard
  }
}

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulando um tempo de carregamento
    const timer = setTimeout(() => {
      // Neste exemplo, usamos todos os hamburgueres como favoritos.
      setFavoritos(produtosData.hamburgueres || [])
      setLoading(false)
    }, 2000) // 2 segundos de loading

    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      {loading ? (
        // Versão skeleton completa da página
        <>
          <div className="skeleton header-skeleton"></div>
          <div className="favoritos-page-container">
            <div className="titulo-favoritos-skeleton skeleton"></div>
            <div className="div_favoritos-wrapper">
              <button className="btn-carrossel esquerda" disabled>
                <span>&lt;</span>
              </button>

              <div className="div_favoritos">
                {/* Renderiza 4 cards skeleton */}
                {[1, 2, 3, 4].map((_, index) => (
                  <div key={index} className="favorito-card-skeleton">
                    <div className="favorito-imagem-skeleton skeleton"></div>
                    <div className="favorito-textos-skeleton">
                      <div className="favorito-nome-skeleton skeleton"></div>
                      <div className="favorito-descricao-skeleton skeleton"></div>
                      <div className="favorito-descricao-skeleton skeleton"></div>
                      <div className="favorito-preco-skeleton skeleton"></div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-carrossel direita" disabled>
                <span>&gt;</span>
              </button>
            </div>
          </div>
          <div className="skeleton sub-nav-skeleton"></div>
        </>
      ) : (
        // Versão real completa da página
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <div className="favoritos-page-container">
            <h1>Favoritos</h1>
            <div className="div_favoritos-wrapper">
              <button className="btn-carrossel esquerda" onClick={() => scrollCarrossel("esquerda")}>
                <span>&lt;</span>
              </button>

              <div className="div_favoritos" id="carrosselFavoritos">
                {favoritos.map((item) => (
                  <Favoritos
                    key={item.id}
                    nome={item.nome}
                    valor={`R$ ${item.preco}`}
                    descricao={item.descricao}
                    imagem={item.imagem}
                  />
                ))}
              </div>

              <button className="btn-carrossel direita" onClick={() => scrollCarrossel("direita")}>
                <span>&gt;</span>
              </button>
            </div>
          </div>
          <SubNavigation />
        </>
      )}
    </div>
  )
}
