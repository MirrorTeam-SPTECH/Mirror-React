import produtosData from "./produtos.json"

/**
 * Obtém a lista de produtos favoritos
 * @returns {Promise} - Promise que resolve com a lista de favoritos
 */
export function obterFavoritos() {
  // Simulando uma chamada assíncrona para API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Neste exemplo, usamos todos os hamburgueres como favoritos
      // Em uma aplicação real, você buscaria os favoritos do usuário de uma API
      resolve(produtosData.hamburgueres || [])
    }, 1500) // Simula um delay de 1.5 segundos
  })
}

/**
 * Adiciona um produto aos favoritos
 * @param {Object} produto - Produto a ser adicionado aos favoritos
 * @returns {Promise} - Promise que resolve quando o produto for adicionado
 */
export function adicionarFavorito(produto) {
  // Implementação real conectaria com uma API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Produto adicionado aos favoritos:", produto)
      resolve(true)
    }, 500)
  })
}

/**
 * Remove um produto dos favoritos
 * @param {string|number} produtoId - ID do produto a ser removido
 * @returns {Promise} - Promise que resolve quando o produto for removido
 */
export function removerFavorito(produtoId) {
  // Implementação real conectaria com uma API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Produto removido dos favoritos:", produtoId)
      resolve(true)
    }, 500)
  })
}
    