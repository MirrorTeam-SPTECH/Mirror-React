import { CardProduto } from "./CardProduto";
import styles from '../styles/ListaProdutos.module.css';

export function ListaProdutos({ titulo, produtos }) {
  return (
    <div className={styles.containerListaProdutos}>
    <div className={styles.listaProdutos}>
      <h2 className={styles.titulo}>{titulo}</h2>
      <div className={styles.lista}>
        {produtos.map((produto, index) => (
          <CardProduto
            key={index}
            nome={produto.nome}
            tempo={produto.tempo}
            preco={produto.preco}
            imagem={produto.imagem}
          />
        ))}
      </div>
    </div>
    </div>
  );
}