import React from "react";
import { CardProduto } from "./CardProduto";
import styles from "../styles/ListaProdutos.module.css";

export function ListaProdutos({ categorias, onProdutoClick, compact, refs }) {
  return (
    <div className={styles.containerListaProdutos}>
      <div className={styles.listaProdutos}>
        {categorias.map((categoria) => (
          <div
            key={categoria.titulo}
            className={styles.categoriaContainer}
            ref={(el) => (refs.current[categoria.titulo] = el)}
          >
            <h2 className={styles.titulo}>{categoria.titulo}</h2>
            <div
              className={`${styles.lista} ${compact ? styles.compact : ""}`}
            >
              {categoria.produtos.map((produto) => (
                <CardProduto
                  key={produto.id}
                  nome={produto.nome}
                  tempo={produto.tempoPreparo}
                  preco={produto.preco}
                  imagem={produto.imagem}
                  onClick={() => onProdutoClick(produto)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
