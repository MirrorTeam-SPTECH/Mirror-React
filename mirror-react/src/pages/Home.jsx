"use client"

// src/pages/HomeCarregamento.jsx
import { useEffect, useState } from "react"
import { Header } from "../components/Header"
import { Pesquisa } from "../components/Pesquisa"
import { NavigationBar } from "../components/NavigationBar"
import { ListaProdutos } from "../components/ListaProdutos"
import { SubNavigation } from "../components/SubNavigation"
import "../styles/Carregamento.css"
import { todasCategorias } from "../utils/Categorias"

export default function HomeCarregamento() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula carregamento de 3 segundos
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer) // boa prática
  }, [])

  return (
    <div className="containerProjeto">
      {loading ? (
        // Versão skeleton de todos os componentes
        <>
          {/* Header Skeleton */}
          <div className="skeleton header-skeleton"></div>

          {/* Pesquisa Skeleton */}
          <div className="skeleton pesquisa-skeleton"></div>

          {/* NavigationBar Skeleton */}
          <div className="skeleton nav-skeleton">
          </div>

          {/* ListaProdutos Skeleton - Repetir para cada categoria */}
          {todasCategorias.map((_, index) => (
            <div className="skeleton lista-produto-skeleton" key={index}>
              <div className="categoria-titulo-skeleton skeleton"></div>
              <div className="produtos-grid-skeleton">
                {/* Repetir para cada produto (5 por linha) */}
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div className="produto-card-skeleton skeleton" key={i}></div>
                  ))}
              </div>
            </div>
          ))}

          {/* SubNavigation Skeleton */}
          <div className="skeleton sub-nav-skeleton"></div>
        </>
      ) : (
        // Componentes reais
        <>
          <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
          <Pesquisa />
          <NavigationBar />
          <ListaProdutos categorias={todasCategorias} />
          <SubNavigation />
        </>
      )}
    </div>
  )
}
