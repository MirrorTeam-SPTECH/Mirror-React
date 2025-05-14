import { CardProduto } from "./CardProduto";
import styles from "../styles/ListaProdutos.module.css";
import { useLocation } from "react-router-dom";

export function ListaProdutos({ categorias, onProdutoClick, compact }) {
  const location = useLocation();
  const isGerenciamento =
    location.pathname.startsWith("/novoPedido") ||
    location.pathname.startsWith("/cardapioEditar");

  const normalizeId = (titulo) =>
    titulo
      .normalize("NFD")
      .replace(/[^\w\s-]/g, "") // remove acentos e caracteres especiais
      .toLowerCase()
      .replace(/\s+/g, "");

  const renderCategoria = (categoriaData) => {
    const categoriaKey = normalizeId(categoriaData.titulo);

    return (
      <div
        key={categoriaKey}
        id={categoriaKey}
        className={styles.categoriaContainer}
      >
        <div className="flex flex-row items-center justify-start mb-2 mt-2 gap-2">
          <span className="h-[25px] w-[6px] bg-amber-400"></span>
          <h2 className="text-[1.3rem] font-bold text-start text-[#CC0000]">
            {categoriaData.titulo}
          </h2>
        </div>
        <div className={`${styles.lista} ${compact ? styles.compact : ""}`}>
          {categoriaData.produtos.map((produto) => (
            <CardProduto
              key={`${categoriaKey}-${produto.id}`}
              id={produto.id}
              nome={produto.nome}
              tempo={produto.tempoPreparo}
              preco={produto.preco}
              imagem={produto.imagem}
              categoria={categoriaKey}        // passa a categoria para o CardProduto
              onClick={() => onProdutoClick(produto)}
              isGerenciamento={isGerenciamento}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${styles.containerListaProdutos} ${
        isGerenciamento ? styles.expandido : ""
      }`}
    >
      <div className={styles.listaProdutos}>
        {categorias.map(renderCategoria)}
      </div>
    </div>
  );
}
