import styles from '../styles/ListaProdutos.module.css';

export function CardProduto({ nome, tempo, preco }) {
  return (
    <div className={styles.cardProduto}>
      <p className={styles.nome}>{nome}</p>
      <p className={styles.tempo}>{tempo}</p>
      <p className={styles.preco}>R$ {preco}</p>
    </div>
  );
}
