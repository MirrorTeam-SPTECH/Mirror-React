import { CardProduto } from "./CardProduto";
import styles from "../styles/ListaProdutos.module.css";
import { useLocation } from "react-router-dom";

export function ListaProdutos({ categorias, onProdutoClick, compact }) {
  const location = useLocation();
  const isGerenciamento =
    location.pathname.startsWith("/novoPedido") ||
    location.pathname.startsWith("/cardapioEditar");

  const normalizeId = (titulo) => titulo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "");

  const renderCategoria = (categoria, index) => {
    const categoriaId = normalizeId(categoria.titulo);

    return (
      <div
        key={index}
        id={categoriaId} // Define o ID dinâmico
        className={styles.categoriaContainer}
      >
        <div className="flex flex-row items-center justify-start mb-2 mt-2 gap-2">
          <span className="h-[25px] w-[6px] bg-amber-400"></span>
          <h2 className="text-[1.3rem] font-bold text-start text-[#CC0000] pl-[10px]">
            {categoria.titulo}
          </h2>
        </div>
        <div className={`${styles.lista} ${compact ? styles.compact : ""}`}>
          {categoria.produtos.map((produto) => (
            <CardProduto
              key={produto.id}
              id={produto.id}
              nome={produto.nome}
              tempo={produto.tempoPreparo}
              preco={produto.preco}
              imagem={produto.imagem}
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
<<<<<<< HEAD
        {categorias.map((categoria, ci) => (
          <div
            key={ci}
            id={categoria.titulo
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")} // Normaliza o ID
            className={styles.categoriaContainer}
          >
            <div className="flex flex-row items-center justify-start mb-2 mt-2 gap-2">
              <span className="h-[25px] w-[6px] bg-amber-400"></span>
              <h2 className="text-[1.3rem] font-bold text-start text-[#CC0000] pl-[10px]">
                {categoria.titulo}
              </h2>
            </div>
            <div className={`${styles.lista} ${compact ? styles.compact : ""}`}>
              {categoria.produtos.map((produto) => (
                <CardProduto
                  key={produto.id}
                  id={produto.id}
                  nome={produto.nome}
                  tempo={produto.tempoPreparo}
                  preco={produto.preco}
                  imagem={produto.imagem}
                  categoria={categoria.titulo}
                  onClick={() => onProdutoClick(produto)}
                  isGerenciamento={isGerenciamento}
                />
              ))}
            </div>
          </div>
        ))}
=======
        {categorias.map(renderCategoria)}
>>>>>>> ad1df1538022a2859ad4aca6046f61768b682dee
      </div>
    </div>
  );
}