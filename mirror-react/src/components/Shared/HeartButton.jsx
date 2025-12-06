"use client";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import "../../styles/HeartButton.css";
export default function HeartButton({ produtoId, categoria, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
    }
  }, []);
  useEffect(() => {
    if (!userEmail) return;

    const checkFavoriteStatus = () => {
      const favKey = `favoritos_${userEmail}`;
      const favoritos = JSON.parse(localStorage.getItem(favKey)) || [];
      const found = favoritos.some(
        (fav) => fav && fav.id === produtoId && fav.categoria === categoria
      );
      setIsFavorite(found);
    };
    checkFavoriteStatus();

    const handleFavoritosUpdate = () => {
      checkFavoriteStatus();
    };
    window.addEventListener("favoritosAtualizados", handleFavoritosUpdate);
    return () =>
      window.removeEventListener("favoritosAtualizados", handleFavoritosUpdate);
  }, [produtoId, categoria, userEmail]);
  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!userEmail) {
      console.warn(
        "⚠️ Usuário não logado. Não é possível adicionar favoritos."
      );
      return;
    }
    console.log("🔷 Toggle favorito:", { produtoId, categoria, userEmail });

    if (!produtoId || !categoria) {
      console.error("❌ Erro: produtoId ou categoria ausente", {
        produtoId,
        categoria,
      });
      return;
    }

    const favKey = `favoritos_${userEmail}`;

    let favoritos = JSON.parse(localStorage.getItem(favKey)) || [];
    favoritos = favoritos.filter(Boolean);
    const isAlreadyFavorite = favoritos.some(
      (fav) => fav && fav.id === produtoId && fav.categoria === categoria
    );

    if (isAlreadyFavorite) {
      favoritos = favoritos.filter(
        (fav) => fav && !(fav.id === produtoId && fav.categoria === categoria)
      );
      console.log("❤️ Removido dos favoritos");
    } else {
      favoritos.push({ id: produtoId, categoria });
      console.log("💚 Adicionado aos favoritos");
    }
    console.log("📋 Favoritos atualizados para", userEmail, ":", favoritos);

    localStorage.setItem(favKey, JSON.stringify(favoritos));

    setIsFavorite(!isAlreadyFavorite);

    if (onToggle) {
      onToggle(!isAlreadyFavorite);
    }

    window.dispatchEvent(new Event("favoritosAtualizados"));
  };
  return (
    <div className="heart-icon" onClick={toggleFavorite}>
      <Heart
        size={24}
        color="#e46363"
        fill={isFavorite ? "#e46363" : "none"}
        strokeWidth={2}
      />
    </div>
  );
}