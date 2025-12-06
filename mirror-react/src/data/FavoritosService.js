import produtosData from "./produtos.json"
export function obterFavoritos() {

  return new Promise((resolve) => {
    setTimeout(() => {


      resolve(produtosData.hamburgueres || [])
    }, 1500)
  })
}
export function adicionarFavorito(produto) {

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Produto adicionado aos favoritos:", produto)
      resolve(true)
    }, 500)
  })
}
export function removerFavorito(produtoId) {

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Produto removido dos favoritos:", produtoId)
      resolve(true)
    }, 500)
  })
}