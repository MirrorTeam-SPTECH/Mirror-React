import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import "../../styles/HeartButton.css";

export default function HeartButton({ produtoId, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    setIsFavorite(favoritos.includes(produtoId));
  }, [produtoId]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    let updatedFavoritos;

    if (favoritos.includes(produtoId)) {
      updatedFavoritos = favoritos.filter((id) => id !== produtoId);
    } else {
      updatedFavoritos = [...favoritos, produtoId];
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