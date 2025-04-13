import { CardProduto } from "./CardProduto"
import styles from "../styles/ListaProdutos.module.css"

export function ListaProdutos({ categorias }) {
  return (
    <div className={styles.containerListaProdutos}>
      <div className={styles.listaProdutos}>
        {categorias.map((categoria, catIndex) => (
          <div key={catIndex} className={styles.categoriaContainer}>
            <h2 className={styles.titulo}>{categoria.titulo}</h2>
            <div className={styles.lista}>

              {categoria.produtos.map((produto, prodIndex) => (
                <CardProduto
                  key={`${catIndex}-${prodIndex}`}
                  nome={produto.nome}
                  tempo={produto.tempoPreparo}
                  preco={produto.preco}
                  imagem={produto.imagem}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
