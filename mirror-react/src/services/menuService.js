import api from "../config/api";

/**
 * Serviço para gerenciamento do cardápio
 */
const menuService = {
  /**
   * Busca todos os itens ativos do cardápio
   * @returns {Promise<Array>} - Lista de itens do cardápio
   */
  getAllItems: async () => {
    const response = await api.get("/api/menu-items");
    return response.data;
  },

  /**
   * Busca item por ID
   * @param {number} id - ID do item
   * @returns {Promise<Object>} - Dados do item
   */
  getItemById: async (id) => {
    const response = await api.get(`/api/menu-items/${id}`);
    return response.data;
  },

  /**
   * Busca itens por categoria
   * @param {string} category - Categoria do item
   * @returns {Promise<Array>} - Lista de itens da categoria
   */
  getItemsByCategory: async (category) => {
    const response = await api.get(`/api/menu-items/category/${category}`);
    return response.data;
  },

  /**
   * Cria novo item do cardápio (requer autenticação admin)
   * @param {Object} itemData - Dados do novo item
   * @returns {Promise<Object>} - Item criado
   */
  createItem: async (itemData) => {
    const response = await api.post("/api/menu-items", itemData);
    return response.data;
  },

  /**
   * Atualiza item do cardápio (requer autenticação admin)
   * @param {number} id - ID do item
   * @param {Object} itemData - Dados atualizados do item
   * @returns {Promise<Object>} - Item atualizado
   */
  updateItem: async (id, itemData) => {
    const response = await api.put(`/api/menu-items/${id}`, itemData);
    return response.data;
  },

  /**
   * Remove item do cardápio (requer autenticação admin)
   * @param {number} id - ID do item
   * @returns {Promise<void>}
   */
  deleteItem: async (id) => {
    await api.delete(`/api/menu-items/${id}`);
  },
};

export default menuService;
