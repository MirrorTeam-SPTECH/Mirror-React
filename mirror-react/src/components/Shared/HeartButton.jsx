"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import "../../styles/HeartButton.css"

export default function HeartButton({ produtoId, categoria, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Verificar o estado inicial
    const checkFavoriteStatus = () => {
      const favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
      const found = favoritos.some((fav) => fav && fav.id === produtoId && fav.categoria === categoria)
      setIsFavorite(found)
    }

    checkFavoriteStatus()

    // Atualiza quando outro componente dispara o evento
    const handleFavoritosUpdate = () => {
      checkFavoriteStatus()
    }

    window.addEventListener("favoritosAtualizados", handleFavoritosUpdate)
    return () => window.removeEventListener("favoritosAtualizados", handleFavoritosUpdate)
  }, [produtoId, categoria])

  const toggleFavorite = (e) => {
    e.stopPropagation()

    // Obter favoritos atuais
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || []
    favoritos = favoritos.filter(Boolean) // Remover valores nulos/undefined

    const isAlreadyFavorite = favoritos.some((fav) => fav && fav.id === produtoId && fav.categoria === categoria)

    // Atualizar lista de favoritos
    if (isAlreadyFavorite) {
      favoritos = favoritos.filter((fav) => fav && !(fav.id === produtoId && fav.categoria === categoria))
    } else {
      favoritos.push({ id: produtoId, categoria })
    }

    // Salvar no localStorage
    localStorage.setItem("favoritos", JSON.stringify(favoritos))

    // Atualizar estado local
    setIsFavorite(!isAlreadyFavorite)

    // Chamar callback se existir
    if (onToggle) {
      onToggle(!isAlreadyFavorite)
    }

    // Notificar outros componentes
    window.dispatchEvent(new Event("favoritosAtualizados"))
  }

  return (
    <div className="heart-icon" onClick={toggleFavorite}>
      <Heart size={24} color="#e46363" fill={isFavorite ? "#e46363" : "none"} strokeWidth={2} />
    </div>
  )
}
