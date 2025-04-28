import styles from "../styles/ListaProdutos.module.css"

export function CardProduto({ nome, tempo, preco, imagem, onClick }) {
  return (
    <div className={styles.cardProduto} onClick={onClick}>
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
  )
}
