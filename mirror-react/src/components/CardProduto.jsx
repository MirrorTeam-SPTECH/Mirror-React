import { useState } from "react";
import HeartButton from "../components/Shared/HeartButton";
import styles from "../styles/ListaProdutos.module.css";

export function CardProduto({ id, nome, tempo, preco, imagem, categoria, onClick, isGerenciamento }) {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <div
      className={`${styles.cardProduto} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      {isGerenciamento ? (
        <div
          className={`${styles.selectButton} ${isSelected ? styles.active : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleSelect();
          }}
        >
          {isSelected ? "" : ""}
        </div>
      ) : (
        <HeartButton produtoId={id} categoria={categoria} />
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