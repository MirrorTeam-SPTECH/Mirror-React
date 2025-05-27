import { useState } from "react";
import HeartButton from "../components/Shared/HeartButton";
import ButtonSelect from "../components/Shared/ButtonSelect";
import styles from "../styles/ListaProdutos.module.css";

export function CardProduto({
  id,
  nome,
  tempo,
  preco,
  imagem,
  categoria,
  onClick,
  onFavoritar, // função que recebe (id, categoria, isNowFavorite)
  isGerenciamento,
}) {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelect = (e) => {
    e.stopPropagation();
    setIsSelected(prev => !prev);
  };

  // Callback executado quando o HeartButton alterna favorito
  const handleToggleFavorite = (isNowFavorite) => {
    if (onFavoritar) {
      onFavoritar(id, categoria, isNowFavorite);
    }
  };

  return (
    <div
      className={`${styles.cardProduto} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      {isGerenciamento ? (
         <>
        <div
          className={`${styles.selectButton} ${isSelected ? styles.active : ""}`}
          onClick={toggleSelect}
        >
          {isSelected ? "Selecionado" : ""}
        </div>
        <ButtonSelect 
        produtoId={id}
        categoria={categoria}
        selected={isSelected} 
        onClick={toggleSelect} />
       </>
      ) : (
        <HeartButton
          produtoId={id}
          categoria={categoria}
          onToggle={handleToggleFavorite}
        />
      )}

      {imagem && (
        <img
          src={imagem}
          alt={nome}
          className="w-auto h-[120px] object-cover rounded-[12px] mb-3"
        />
      )}

      <p className={styles.nome}>{nome}</p>
      <p className={styles.tempo}>{tempo}</p>
      <p className={styles.preco}>R$ {preco}</p>
    </div>
  );
}
