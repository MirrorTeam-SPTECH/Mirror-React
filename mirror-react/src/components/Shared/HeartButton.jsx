import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import "../../styles/HeartButton.css";

export default function HeartButton({ produtoId, categoria, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const produtoKey = `${categoria}-${produtoId}`;
    setIsFavorite(favoritos.includes(produtoKey));
  }, [produtoId, categoria]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    const produtoKey = `${categoria}-${produtoId}`;
    let updatedFavoritos;

    if (favoritos.includes(produtoKey)) {
      updatedFavoritos = favoritos.filter((id) => id !== produtoKey);
    } else {
      updatedFavoritos = [...favoritos, produtoKey];
    }

    localStorage.setItem("favoritos", JSON.stringify(updatedFavoritos));
    setIsFavorite(!isFavorite);

    if (onToggle) onToggle(!isFavorite);
  };

  return (
    <div className="heart-icon" onClick={toggleFavorite}>
      <Heart size={20} color={isFavorite ? "#e46363" : "#e46363"} fill={isFavorite ? "#e46363" : "none"} />
    </div>
  );
}