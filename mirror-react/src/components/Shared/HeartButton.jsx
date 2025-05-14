import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import "../../styles/HeartButton.css";

export default function HeartButton({ produtoId, categoria, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const found = favoritos.some(fav => fav && fav.id === produtoId && fav.categoria === categoria);
    setIsFavorite(found);
  }, [produtoId, categoria]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos = favoritos.filter(Boolean); // remove nulls/undefined
    const isAlreadyFavorite = favoritos.some(fav => fav && fav.id === produtoId && fav.categoria === categoria);

    if (isAlreadyFavorite) {
      favoritos = favoritos.filter(fav => fav && !(fav.id === produtoId && fav.categoria === categoria));
    } else {
      favoritos.push({ id: produtoId, categoria });
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    setIsFavorite(!isFavorite);
    if (onToggle) onToggle(!isFavorite);
  };

  return (
    <div className="heart-icon" onClick={toggleFavorite}>
      <Heart
        size={20}
        color={isFavorite ? "#e46363" : "#e46363"}
        fill={isFavorite ? "#e46363" : "none"}
      />
    </div>
  );
}
